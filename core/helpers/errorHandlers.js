const ErrorBoundary = require('./ErrorBoundary');

const dbCastErrorHandler = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new ErrorBoundary(message, 404);
}

const dbDuplicateFieldHandler = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new ErrorBoundary(message, 400);
};

const dbValidationErrorHandler = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ErrorBoundary(message, 400);
};

const jwtErrorHandler = () =>
  new ErrorBoundary('Invalid token. Please log in again!', 401);

const expiredJWTErrorhandler = () =>
  new ErrorBoundary('Your token has expired! Please log in again.', 401);

const sendDevError = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
        });
    }

    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    });
};
  
const sendProdError = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
        });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};
  
module.exports = (err, req, res, next) => {
    // console.log(err.stack);
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      sendDevError(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;
  
      if (error.name === 'CastError') error = dbCastErrorHandler(error);
      if (error.code === 11000) error = dbDuplicateFieldHandler(error);
      if (error.name === 'ValidationError')
        error = dbValidationErrorHandler(error);
      if (error.name === 'JsonWebTokenError') error = jwtErrorHandler();
      if (error.name === 'TokenExpiredError') error = expiredJWTErrorhandler();
  
      sendProdError(error, req, res);
    }
};
  