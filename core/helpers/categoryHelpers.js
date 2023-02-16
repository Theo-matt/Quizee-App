const Category = require('../models/categoryModel');
const tryCatch = require('../helpers/tryCatch');



const buildAncestors = tryCatch(async (id, parent_id) => {
    let parent = await Category.findOne({ "_id": parent_id },{ "name": 1, "slug": 1, "ancestors": 1 })


        if( parent ) {
            const { _id, name, slug } = parent;

            const category = await Category.findByIdAndUpdate(id, 
                { $set: { "ancestors": [{ _id, name, slug }, ...parent.ancestors], "parent": parent_id} },
                { 
                new: true,
                runValidators: true
            });
        }
 
})


// Rebuild and update the ancestors array of the category and 
// all its descendants by calling the following helper function
const buildHierarchyAncestors = tryCatch(async ( category_id, parent_id ) => {
    
    let result;

    if( category_id && parent_id ){

        buildAncestors(category_id, parent_id)
        
        result = await Category.find({ 'parent': category_id });
    }


    if(result){

        result.forEach((doc) => {buildHierarchyAncestors(doc._id, category_id)});
    } 
    
});

exports.buildHierarchyAncestors = buildHierarchyAncestors;
