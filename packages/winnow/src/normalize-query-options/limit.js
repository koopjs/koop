const logManager = require('../log-manager');

/**
 * Normalize the limit option; defaults to undefined
 * @param {object} options
 * @returns {integer} or undefined
 */
function normalizeLimit(options) {
  const limit = getLimitFromOptions(options);

  if (limit !== undefined && !Number.isInteger(limit)) {
    logManager.logger.debug('"limit" option is not an integer; skipping');
    return;
  }
  // If there is a limit, add 1 to it so we can later calculate a exceededTransferLimit. The result set will be resized accordingly, post SQL
  return limit ? limit + 1 : undefined;
}

function getLimitFromOptions(options) {
  if (options.limit !== undefined) return options.limit;

  if (options.resultRecordCount !== undefined) return options.resultRecordCount;

  if (options.count !== undefined) return options.count;

  if (options.maxFeatures !== undefined) return options.maxFeatures;
}

module.exports = normalizeLimit;
