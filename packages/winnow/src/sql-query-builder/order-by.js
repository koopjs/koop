function createOrderByClause (options = {}) {
  const { order: orderByArray, esri, aggregates } = options;
  if (!orderByArray) return '';

  const selector = esri ? 'attributes' : 'properties';

  const orderByClause = orderByArray.map(orderBy => {
    const [field, direction = 'ASC'] = orderBy.split(' ');
    if (shouldFormatForAggregationQuery(field, aggregates)) {
      return `\`${field}\` ${direction.toUpperCase()}`;
    }
    return `${selector}->\`${field}\` ${direction.toUpperCase()}`;
  }).join(', ');

  return ` ORDER BY ${orderByClause}`;
}

function shouldFormatForAggregationQuery (field, aggregations) {
  return aggregations && aggregations.some(({ name }) => {
    return field === name;
  });
}

module.exports = createOrderByClause;
