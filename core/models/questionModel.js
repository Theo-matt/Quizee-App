const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true,
    },

    questionImage: String,

    quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz',
        default: 'null'
    },

    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Please you must log in to create a question'],
        ref: 'User'
    },

    questionType: {
        type: String,
        enum: ['multiple_choices', 'fillin_gaps', 'essay', 'checkboxes'],
        default: 'multiple_choices'       
    },

    level: {
        type: String,
        required: [true, 'A question must have level'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Question level must be easy, medium or difficult'
        }
    },

    gameMode: {
        type:Boolean,
        default: true,
    },

    score: Number,

    questionOptions: [
        {
           type: mongoose.Schema.ObjectId,
           ref: 'Option',
           unique: true
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

    updatedAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


questionSchema.pre(/^find/, function(next){
    this.populate({
        path: 'createdBy',
        select: 'firstname -_id'
    })
    .populate({
        path: 'quiz',
        select: 'title '
    })
    .populate({
        path: 'questionOptions',
        select: 'optionText _id'
    });

    next();
})




const Question = mongoose.model('Question', questionSchema);

module.exports = Question;