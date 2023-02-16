const mongoose = require('mongoose');
// const Category = require('../models/categoryModel');

const quizSchema = new mongoose.Schema({
    
    category: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'A quiz must be categorized'],
        ref: 'Category'
    },

    classroom: {
        type: mongoose.Schema.ObjectId,
        default: null,
        ref: 'ClassRoom'
    },

    title: {
        type: String,
        required: [true, 'A quiz must have a title'],
        unique: true
    },

    instruction: {
        type: String,
        defualt: 'Answer All questions'
    },

    duration: {
        type: String,
        required: [true, 'A quiz must have a duration']
    },

    slug: String,

    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

    updatedAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

    startsAt: {
        type: Date,
        default: Date.now()
    },

    endsAt: {
        type: Date,
        default: Date.now()
    },

    published: {
        type: String,
        required: [true, 'A quized must have a mode'],
        enum: {
            values: ['public', 'private'],
            message: 'Published must either be public or private'
        }
    },

    maxAttempts: {
        type: Number,
        default: 1
    },

    Number_of_questions: {
        type: Number,
        defualt: 5
    },

    order_of_questions: {
        type: String,
        default: 'Shuffle questions and answers'
    },

    custom_end_message: String,

    show_custom_message: {
        type: Boolean,
        default: false
    },

    show_result: {
        type: Boolean,
        default: false
    },

    show_try_again_button: String,
    show_graded_report: String,
    show_correct_answers: String
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

quizSchema.index({title: 1}, {unique: true});

// Virtual populate
quizSchema.virtual('questions', {
    ref: 'Question',                      
    foreignField: 'quiz',
    localField: '_id'
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;