const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const reminderController = require('./controllers/reminderController');
const globalErrorHandler = require('./controllers/errorController');
const remindersRouter = require('./routers/reminderRouter');
const userRouter = require('./routers/userRouter');
const AppError = require('./utils/appError');

const app = express();

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Getting access to req.body (converting JSON to JS Object)
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Console request logging middleware
app.use(morgan('dev'));

app.use('/api/reminders', remindersRouter);
app.use('/api/users', userRouter);


setInterval(() => {
  reminderController.manageReminders();
}, 1000 * 60 * 60); // Co godzinę

//reminderController.manageReminders();

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  // Możemy w next() podać argument i Express będzie automatycznie wiedział, że ten argument to error. Zawsze jak podamy jakiś argument w next(), to Express weźmie go za error. Po tym Express pominie inne middlewares na stacku i przejdzie od razu do naszego global error middleware, który jest zdefiniowany poniżej.
});

app.use(globalErrorHandler);

module.exports = app;
