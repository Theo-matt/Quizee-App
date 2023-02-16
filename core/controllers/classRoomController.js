const ClassRoom = require('./../models/classroomModel');
const factory = require('./handleFactory');
const subFactory = require('./handleSubdocs');


exports.setParentId = (req, res, next) => {
    if(req.params.parentId && !req.body.parent) req.body.parent = req.params.parentId;
    if(!req.body.theHead) req.body.theHead = req.user.id;

    next();
}

exports.beforeDelete = async(req, res, next) => {
    if(req.params.id){
        await Category.deleteMany({"ancestors._id": req.params.id});
    }

    next();
}


//Creating the root category
exports.createClassRoom = factory.createOne(ClassRoom);
exports.getAllClassRooms = factory.getAll(ClassRoom, '-ancestors._id');
exports.getDecendants = factory.getAll(ClassRoom, "-_id -slug -parent -ancestors");
exports.updateClassRoom = factory.updateOne(ClassRoom);
exports.getOneClassRoom = factory.getOne(ClassRoom, {path: 'quizzes', select: 'title -_id'});
exports.deleteClassRoom = factory.deleteOne(ClassRoom);
exports.moveClassRoom = subFactory.moveDocs(ClassRoom);
exports.renameClassRoom = subFactory.renameDocs(ClassRoom);


