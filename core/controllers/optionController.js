const Option = require('./../models/optionModel');
const factory = require('./handleFactory');
const tryCatch = require('./../helpers/tryCatch');
const Question = require('./../models/questionModel');
const ErrorBoundary = require('./../helpers/ErrorBoundary');

exports.setQuestionOptionIds = async (req, res, next) => {
    // Allow nested routes
    if (!req.body.question) req.body.question = req.params.questionId;  
    
    next();
};

const createOption = async(body, paramId) =>{
    const optionData = await Option.create(body);

    await Question.findByIdAndUpdate(
        paramId, 
        { $push: { questionOptions: optionData._id } },
        { new: true, useFindAndModify: false }
    )

    return optionData;
}


exports.addOption = tryCatch(async (req, res, next) => {

    let data;

    const doc = await Question.findById(req.params.questionId);

    if(!doc) return next(new ErrorBoundary("No question with such ID exists", 404))

    if(doc.questionOptions.length === 0){

        data = await Promise.all([createOption(req.body, req.params.questionId)]);
    }
    
    const filterdArr = doc.questionOptions.filter( options => options.optionText === req.body.optionText );

    if(filterdArr.length !== 0) return next(new ErrorBoundary('Option is Repeated. Enter a different option', 400));

    if(doc.questionOptions.length !== 0 && filterdArr.length === 0){

        data = await Promise.all([createOption(req.body, req.params.questionId)]);
    }
    
    res.status(201).json({
        optionData: data
    })

})

// exports.addOption = factory.createOne(Option);