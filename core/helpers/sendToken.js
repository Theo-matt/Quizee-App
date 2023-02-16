module.exports = async (user, statusCode, res) => {
    const token = await user.generateAuthToken();

    const cookieOptions =  {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPR * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
};
