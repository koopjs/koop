
class GeoServiceError extends Error {
  constructor (code, message, details = []) {
    super(message);
    this.code = code;

    this.details = Array.isArray(details) ? details : [details];

    Error.captureStackTrace(this, GeoServiceError);
  }
}

module.exports = { GeoServiceError };