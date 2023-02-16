const Question = require('./../models/questionModel');
const factory = require('./handleFactory');
const Quiz = require('./../models/quizModel');
const ErrorBoundary = require('./../helpers/ErrorBoundary');
const Option = require('./../models/optionModel');


exports.setQuizQuestionIds = async (req, res, next) => {
    // Allow nested routes
    if (!req.body.quiz) req.body.quiz = req.params.id;

    if(req.params.id){
        const doc = await Quiz.findById(req.params.id);

        if(!doc) return next(new ErrorBoundary("The quiz with such Id is not found", 404));
    }
  
    if(!req.body.createdBy) req.body.createdBy = req.user.id;
   
    next();
};

exports.beforeDelete = async (req, res, next) => {
    if(req.params.id) await Option.deleteMany({"question": req.params.id});
    
    next();
}



exports.createQuestion = factory.createOne(Question);
exports.getAllQuestions = factory.getAll(Question);
exports.getQuestion = factory.getOne(Question)
exports.deleteQuestion = factory.deleteOne(Question);
exports.updateQuestion = factory.updateOne(Question);