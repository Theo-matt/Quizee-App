const tryCatch = require('./../helpers/tryCatch');
const ErrorBoundary = require('./../helpers/ErrorBoundary');
const slugify = require('slugify');


// Rebuild and update the ancestors array of the category and 
// all its descendants by calling the following helper function
const buildHierarchyAncestors = tryCatch(async ( Model, main_id, parent_id ) => {
    
    let result;

    if( main_id && parent_id ){

        let parent = await Model.findOne({ "_id": parent_id },{ "name": 1, "slug": 1, "ancestors": 1 })


        if( parent ) {
            const { _id, name, slug } = parent;

            const category = await Model.findByIdAndUpdate(main_id, 
                { $set: { "ancestors": [{ _id, name, slug }, ...parent.ancestors], "parent": parent_id} },
                { 
                new: true,
                runValidators: true
            });
        }
        
        result = await Model.find({ 'parent': main_id });
    }

    if(result){

        result.forEach((doc) => {buildHierarchyAncestors(doc._id, main_id)});
    } 
    
});



exports.moveDocs = Model => tryCatch( async (req, res, next) => {
    const doc = await Model.find({"slug": req.params.slug});

    const parent = await Model.findById(req.params.parentId);

    if(!doc) return next(new ErrorBoundary('No category found with that ID', 404));
    if(!parent) return next(new ErrorBoundary('The parents you\'re trying to move to doesn\'t exist', 404));
    
   buildHierarchyAncestors(Model, doc[0]._id, req.params.parentId);
   res.status(200).json({ 
       data: 'Category successfully moved!'  
   })
});

exports.renameDocs = Model => tryCatch( async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.refId, 
        {$set: {"name": req.body.name, "slug": slugify(req.body.name, {lower: true})}},
        {new: true, runValidators: true}
        );

    if(!doc){
        return next(new ErrorBoundary('No document found with that ID', 404));
    }

    await Model.updateOne({"ancestors._id": req.params.refId},
        {$set: {"ancestors.$.name": req.body.name, "ancestors.$.slug": slugify(req.body.name, {lower: true})}}
    );

    res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
    })
})

