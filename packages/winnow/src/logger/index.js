let logger = require('./logger');
const Logger = require('@koopjs/logger');

module.exports = {
  logger,
  setLogger,
};

function setLogger({ logger: _logger, logLevel }) {
  if (_logger) {
    logger = _logger;
    logger.silly('Winnow no longer using default logger.');
    return;
  }

  if (logLevel) {
    logger = new Logger({ logLevel });
  }
}
