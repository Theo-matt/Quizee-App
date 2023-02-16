const Category = require('./../models/categoryModel');
const factory = require('./handleFactory');
const subFactory = require('./handleSubdocs');
const ErrorBoundary = require('./../helpers/ErrorBoundary');


exports.setCatParentIds = async (req, res, next) => {
    if(req.params.parentId && !req.body.parent) req.body.parent = req.params.parentId;

    if(req.params.parentId){
        const doc = await Category.findById(req.params.parentId);

        if(!doc) return next(new ErrorBoundary("The parent category with such Id is not found", 404));
    }

    next();
}

exports.beforeDelete = async(req, res, next) => {
    if(req.params.id){
        await Category.deleteMany({"ancestors._id": req.params.id});
    }

    next();
}


//Creating the root category
exports.createCategory = factory.createOne(Category);
exports.getAllCategories = factory.getAll(Category, '-ancestors._id');
exports.getDecendants = factory.getAll(Category, "-_id -slug -parent -ancestors");
exports.updateCategory = factory.updateOne(Category);
exports.getOneCategory = factory.getOne(Category, {path: 'quizzes', select: 'title -_id'});
exports.deleteCategory = factory.deleteOne(Category);
exports.moveCategory = subFactory.moveDocs(Category);
exports.renameCategory = subFactory.renameDocs(Category);





