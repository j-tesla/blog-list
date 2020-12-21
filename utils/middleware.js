const logger = require('./logger');

const unknownEndpoint = (request, response) => {
  response.status(404)
    .send({ error: 'unknown endpoint' });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400)
      .json({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400)
      .json({ error: error.message });
  }
  if (error.name === 'AuthorizationError') {
    return res.status(401)
      .json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401)
      .json({ error: 'invalid token' });
  }

  next(error);
};
module.exports = {
  unknownEndpoint,
  errorHandler,
};
