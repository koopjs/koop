function createAggregationSelect (aggregates, groupBy, esri) {
  const selector = esri ? 'attributes' : 'properties';
  const select = aggregates.reduce((sql, agg) => {
    let func;
    if (agg.options) {
      func = `${agg.type.toUpperCase()}(${selector}->\`${agg.field}\`, ${agg.options})`;
    } else {
      func = `${agg.type.toUpperCase()}(${selector}->\`${agg.field}\`)`;
    }
    return `${sql} ${func} as \`${agg.name}\`,`;
  }, 'SELECT');
  if (groupBy) return addGroupBy(select, groupBy, selector);
  else return `${select.slice(0, -1)} FROM ?`;
}

function addGroupBy (select, groupBy, selector) {
  const fields = groupBy.reduce((fragment, group) => {
    return `${fragment} ${selector}->\`${group}\` as \`${group}\`,`;
  }, '').slice(0, -1);

  return `${select.slice(0, -1)}, ${fields} FROM ? `;
}

module.exports = createAggregationSelect;
