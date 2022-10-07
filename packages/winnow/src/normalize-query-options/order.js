const { normalizeArray } = require('./helpers');

function normalizeOrder (options) {
  const order = options.order || options.orderByFields;
  if (!order) return;
  return normalizeArray(order);
}

module.exports = normalizeOrder;
