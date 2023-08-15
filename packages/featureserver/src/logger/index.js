let logger = require('./logger');
const Logger = require('../../../logger');
const winnow = require('../../../winnow');

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
