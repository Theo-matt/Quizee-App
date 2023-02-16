const express = require('express');
const quizController = require('../controllers/quizController');
const protect = require('./../middlewares/protect');

const router = express.Router();


router.route('/:categoryId').post(protect, quizController.setQuizUserIds, quizController.createQuiz);

router
    .route('/')
    .get(protect, quizController.getAllQuizzes);

router
    .route('/:id')
    .get(protect, quizController.getQuiz)
    .delete(protect, quizController.deleteQuiz)


    


module.exports = router;
