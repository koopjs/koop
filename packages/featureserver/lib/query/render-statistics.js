const {
  StatisticsFields
} = require('../helpers/fields');

function renderStatisticsResponse (input = {}, options = {}) {
  const { statistics } = input;
  const normalizedStatistics = Array.isArray(statistics) ? statistics : [statistics];
  const features = normalizedStatistics.map(attributes => {
    return { attributes };
  });

  const fields = StatisticsFields.create({
    statistics,
    ...options
  });

  return {
    displayFieldName: '',
    fields,
    features
  };
}

module.exports = { renderStatisticsResponse };
