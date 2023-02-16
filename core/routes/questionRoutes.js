const express = require('express');
const questionController = require('../controllers/questionController');
const protect = require('./../middlewares/protect');

const router = express.Router();


router
    .route('/')
    .get(protect,  questionController.getAllQuestions);

router
    .route('/:id')
    .post(protect, questionController.setQuizQuestionIds, questionController.createQuestion)
    .delete(protect, questionController.beforeDelete, questionController.deleteQuestion);


module.exports = router;