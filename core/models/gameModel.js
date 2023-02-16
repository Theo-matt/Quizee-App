const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A game must have a title']
    },

    duration: {
        type: String,
        required: [true, 'A quiz must have a duration']
    },

    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

    gameImage: {
        type: String,
        defualt: null
    }
})

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;