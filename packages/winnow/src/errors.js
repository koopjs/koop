class InvalidParameterError extends Error {
  constructor (message) {
    super(message);
    this.code = 400;
    Error.captureStackTrace(this, InvalidParameterError);
  }
}

class InvalidWhereParameterError extends Error {
  constructor (message) {
    super(`Invalid "where" parameter: ${message}`);
    this.code = 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { InvalidParameterError, InvalidWhereParameterError };