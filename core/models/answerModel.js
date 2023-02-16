const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    optionRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Option'
    },

    questionRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question'
    }
})

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;