let logger = require('./logger');
const Logger = require('@koopjs/logger');
const winnow = require('@koopjs/winnow');

module.exports = {
  logger,
  setLogger,
};

function setLogger({ logger: _logger, logLevel }) {
  if (_logger) {
    logger = _logger;
    logger.silly('FeatureServer no longer using default logger.');
    winnow.setLogger({ logger });
    return;
  }

  if (logLevel) {
    logger = new Logger({ logLevel });
  }
}
