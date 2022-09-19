/**
 * Normalize the offset option. If no limit is defined, then return offset as undefined. ala-sql
 * requires OFFSET to be paired with a LIMIT
 * @param {object} options
 * @returns {integer} or undefined
 */
function normalizeOffset (options) {
  return (options.limit !== undefined) ? (options.offset || options.resultOffset) : undefined;
}

module.exports = normalizeOffset;
