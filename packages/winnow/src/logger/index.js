const Logger = require('@koopjs/logger');
let logger = new Logger();

module.exports = {
  get logger () {
    return logger;
  },
  setLogger: ({ logger: _logger, logLevel }) => {
    if (_logger) {
      logger = _logger;
      logger.silly('Winnow no longer using default logger.');
      return;
    }
  
    if (logLevel) {
      logger = new Logger({ logLevel });
    }
  }
};
