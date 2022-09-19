function createGroupByClause ({ groupBy, esri } = {}) {
  if (!groupBy) return '';
  const selector = esri ? 'attributes' : 'properties';
  const groups = groupBy.map(group => {
    return `${selector}->\`${group}\``;
  }).join(', ');
  return ` GROUP BY ${groups}`;
}

module.exports = createGroupByClause;
