const express = require('express');
const optionController = require('./../controllers/optionController');

const router = express.Router();

router
    .route('/:questionId')
    .post(optionController.setQuestionOptionIds, optionController.addOption)

module.exports = router;
