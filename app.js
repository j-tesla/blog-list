const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const logger = require('./utils/logger');

const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  logger.info(`connected to ${config.mongoUrl}`);
}).catch(((reason) => {
  logger.error(`failed to connect to${config.mongoUrl}`);
  logger.error(reason);
  process.exit(500);
}));

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
