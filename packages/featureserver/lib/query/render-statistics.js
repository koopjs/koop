const { computeFieldObject } = require('../field')

function renderStatisticsResponse (input = {}, options = {}) {
  const { statistics } = input
  const normalizedStatistics = Array.isArray(statistics) ? statistics : [statistics]
  const features = normalizedStatistics.map(attributes => {
    return { attributes }
  })

  return {
    displayFieldName: '',
    fields: computeFieldObject({
      type: 'FeatureCollection',
      features
    }, 'statistics', options),
    features
  }
}

module.exports = { renderStatisticsResponse }
