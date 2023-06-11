const { InvalidParameterError } = require('../errors');

function normalizeIds(objectIds) {
  if (!objectIds) {
    return;
  }

  if (Array.isArray(objectIds)) {
    return objectIds.map(parseId);
  }

  if (typeof objectIds === 'string') {
    return objectIds.split(',').map(parseId);
  }

  if (typeof objectIds === 'number') {
    return [parseId(objectIds)];
  }

  throw new InvalidParameterError(`Invalid objectIds: ${objectIds}`);
}

function parseId(id) {
  const objectId = Number(id);

  if (Number.isInteger(objectId)) {
    return objectId;
  }

  throw new InvalidParameterError(`Non-integer objectId: ${id}`);
}

module.exports = normalizeIds;
