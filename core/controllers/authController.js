const crypto = require('crypto');
const User = require('./../models/userModel');
const ErrorBoundary = require('./../helpers/ErrorBoundary');
const tryCatch = require('./../helpers/tryCatch');
const sendToken = require('./../helpers/sendToken');
const sendEmail = require('./../helpers/emailHandler');

exports.signup = tryCatch( async (req, res, next) => {
    const newUser = await User.create({  
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      middlename: req.body.middlename,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });
  
    sendToken(newUser, 201, res);
});


//login  a user
exports.login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorBoundary('Please provide email and password!', 400));
  }

  const user = await User.findByCredentials(email, password);

  // 2) Check if user exists && password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorBoundary('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  sendToken(user, 200, res);
});

//Forgot password
exports.forgotPassword = tryCatch( async( req, res, next ) => {

   // 1) Get user based on POSTed email
   const user = await User.findOne({ email: req.body.email });
   if (!user) {
     return next(new ErrorBoundary('There is no user with email address.', 404));
   }
 
   // 2) Generate the random reset token
   const resetToken = user.createPasswordResetToken();
   await user.save({ validateBeforeSave: false });

   //3) Send to Users Email
   const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

   const message = `Forgot your password? Submit a PATCH request with your new password 
   and passwordConfirm to: ${resetURL}.\nIf you did not forget your password, please ignore this mail!`;

   try{
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid only for 10mins)',
        message
      })
  
      res.status(200).json({
        status: 'Success',
        message: 'Token sent to Email!'
      })
   }
   catch(err){
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save({ validateBeforeSave: false });

     return next(new ErrorBoundary('There was an error sending the mail. Try again later!', 500));
   }

})

//Reset password
exports.resetPassword = tryCatch( async( req, res, next ) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new ErrorBoundary('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    sendToken(user, 200, res);
} )

exports.updatePassword = tryCatch(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new ErrorBoundary('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password: User.findByIdAndUpdate will NOT work as intended!
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
  
    // 4) Log user in, send JWT
    sendToken(user, 200, res);
})
  