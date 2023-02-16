const mongoose = require('mongoose');
const slugify = require('slugify');

const classRoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A class must have a name']
    },

    theHead: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A class must have the owner']
    },

    slug: String,

    instructors: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'ClassRoom'
    },

    ancestors: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClassRoom',
            index: true
        },
        
        name: String,
        slug: String
    }]

})


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
classRoomSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

classRoomSchema.pre('save', async function(next){
    let parent_class = await ClassRoom.findOne({ "_id": this.parent },{ "name": 1, "slug": 1, "ancestors": 1 });

    if(parent_class){
        const { _id, name, slug } = parent_class;

        this.ancestors = [{ _id, name, slug }, ...parent_class.ancestors];
    }
    next();
})


const ClassRoom = mongoose.model('ClassRoom', classRoomSchema);
module.exports = ClassRoom;