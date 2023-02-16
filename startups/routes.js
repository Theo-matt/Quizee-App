const express = require('express');
const categoryRouter = require('./../core/routes/categoryRoutes');
const quizRouter = require('./../core/routes/quizRoutes');
const userRouter = require('./../core/routes/userRoutes');
const questionRouter = require('./../core/routes/questionRoutes');
const optionRouter = require('./../core/routes/optionRoutes');
const classRoomRouter = require('./../core/routes/classroomRoutes');


module.exports = function(app) {
    
  app.use(express.json());
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/quizzes', quizRouter );
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/questions', questionRouter); 
  app.use('/api/v1/options', optionRouter);
  app.use('/api/v1/classrooms', classRoomRouter);
}