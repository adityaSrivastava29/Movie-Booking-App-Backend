const { default: mongoose } = require("mongoose");
const { logger } = require("../../Configure/logger.config");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    err.statusCode = 400;
  }
  logger.error(`Error occurred while accessing ${req.path}: ${err.message}`);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
