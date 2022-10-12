class CodedError extends Error {
  constructor (message, code) {
    super(message);
    this.name = 'CodedError';
    this.code = code || 500;
  }
}

module.exports = {
  CodedError
};
