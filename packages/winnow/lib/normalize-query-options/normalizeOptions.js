/**
 * Normalize the limit option; defaults to undefined
 * @param {object} options
 * @returns {integer} or undefined
 */
function normalizeLimit (options) {
  const limit = options.limit || options.resultRecordCount || options.count || options.maxFeatures
  // If there is a limit, add 1 to it so we can later calculate a limitExceeded. The result set will be resized accordingly, post SQL
  if (limit) return limit + 1
}

/**
 * Normalize the offset option. If no limit is defined, then return offset as undefined. ala-sql
 * requires OFFSET to be paired with a LIMIT
 * @param {object} options
 * @returns {integer} or undefined
 */
function normalizeOffset (options) {
  return (options.limit) ? (options.offset || options.resultOffset) : undefined
}

module.exports = {
  normalizeLimit,
  normalizeOffset
}
