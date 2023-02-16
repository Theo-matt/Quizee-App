const Quiz = require('../models/quizModel');
const factory = require('./handleFactory');

exports.setQuizUserIds = (req, res, next) => {
    // Allow nested routes
    if(!req.body.createdBy) req.body.createdBy = req.user.id;
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
};


exports.createQuiz = factory.createOne(Quiz);
exports.getAllQuizzes = factory.getAll(Quiz);
exports.getQuiz = factory.getOne(Quiz, {path: 'questions', select: 'questionText -quiz -_id '});
exports.deleteQuiz = factory.deleteOne(Quiz);
exports.updateQuiz = factory.deleteOne(Quiz);


