const mongoose = require('mongoose');
const Question = require('./questionModel');

const optionSchema = mongoose.Schema({
    optionText: {
        type: String,
        required: [true, 'You must provide the option text'],
        trim: true
    },

    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
    },

    answers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Answer'
        }  
    ]
})


const Option = mongoose.model('Option', optionSchema);
module.exports = Option;