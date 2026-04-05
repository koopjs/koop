function createOrderByClause(options = {}) {
  const { order: orderByArray, esri, aggregates } = options;
  if (!orderByArray) return '';

  const selector = esri ? 'attributes' : 'properties';

  const orderByClause = orderByArray
    .map((orderBy) => {
      const [field, direction = 'ASC', ...extraTokens] = orderBy.trim().split(/\s+/);
      if (!isValidOrderByField(field) || extraTokens.length || !isValidOrderByDirection(direction)) {
        throw new Error('Invalid order by clause');
      }

      const normalizedDirection = direction.toUpperCase();

      if (shouldFormatForAggregationQuery(field, aggregates)) {
        return `\`${field}\` ${normalizedDirection}`;
      }
      return `${selector}->\`${field}\` ${normalizedDirection}`;
    })
    .join(', ');

  return ` ORDER BY ${orderByClause}`;
}

function shouldFormatForAggregationQuery(field, aggregations) {
  return (
    aggregations &&
    aggregations.some(({ name }) => {
      return field === name;
    })
  );
}

function isValidOrderByDirection(direction) {
  const normalizedDirection = direction.toUpperCase();
  return normalizedDirection === 'ASC' || normalizedDirection === 'DESC';
}

function isValidOrderByField(field) {
  return /^[A-Za-z0-9_]+$/.test(field);
}

module.exports = createOrderByClause;
