const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must provide a category name'],
        trim: true,
        unique: true
    },

    slug: {
        type: String,
        index: true
    },

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'Category'
    },

    ancestors: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            index: true
        },
        
        name: String,
        slug: String
    }]
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

categorySchema.index({name: 1}, {unique: true});


// Virtual populate
categorySchema.virtual('quizzes', {
    ref: 'Quiz',                      
    foreignField: 'category',
    localField: '_id'
});


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
categorySchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

categorySchema.pre('save', async function(next){
    let parent_category = await Category.findOne({ "_id": this.parent },{ "name": 1, "slug": 1, "ancestors": 1 });

    if(parent_category){
        const { _id, name, slug } = parent_category;

        this.ancestors = [{ _id, name, slug }, ...parent_category.ancestors];
    }

    next();
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;


