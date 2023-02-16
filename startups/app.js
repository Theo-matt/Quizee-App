const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const ErrorBoundary = require('./../core/helpers/ErrorBoundary');
const globalErrorHandler = require('./../core/helpers/errorHandlers');

const app = express();

// Secure http headers
app.use(helmet());
app.use(helmet.xssFilter())

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Limit request to the API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 60,
    message: 'Too many request from this IP address. Please try again in an hour' 
})

app.use('/api', limiter);

//Body parser; reading data from body into req.body
app.use(express.json({ limit: '10kb'}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp()); 

require('./routes')(app);

app.all('*', (req, res, next) => {
    next(new ErrorBoundary(`Cant find ${req.originalUrl} on this server!`, 404));
})


app.use(globalErrorHandler);

module.exports = app;