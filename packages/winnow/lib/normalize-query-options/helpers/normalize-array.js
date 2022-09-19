function normalizeArray (param) {
  if (Array.isArray(param)) return param;
  if (typeof param === 'string' || param instanceof String) return param.split(',').map(item => item.trim());
}

module.exports = normalizeArray;
