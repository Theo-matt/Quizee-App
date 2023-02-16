const User = require('./../models/userModel');
const factory = require('./handleFactory');
const tryCatch = require('./../helpers/tryCatch');
const ErrorBoundary = require('./../helpers/ErrorBoundary');
const filterObj = require('./../helpers/filterObj');


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};


exports.updateMe = tryCatch( async(req, res, next) => {
    if(req.body.password || req.body.passwordConfirm){
        return next(new ErrorBoundary('This route is not for password update, Please use /updateMyPassword.', 400));
    }

     // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'firstname', 'lastname', 'middlename', 'email', 'phone');
    // if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
        user: updatedUser
        }
    }); 
});


exports.deleteMe = tryCatch(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    });
};
  