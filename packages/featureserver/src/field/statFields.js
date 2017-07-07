const _ = require('lodash')
const moment = require('moment')

module.exports = function (stats) {
  return Object.keys(stats[0]).map(field => {
    const sample = _.find(stats, s => {
      return stats[field] !== null
    })
    const statField = {
      name: field,
      type: detectType(sample[field]),
      alias: field
    }
    if (statField.type === 'esriFieldTypeString') statField.length = 254
    return statField
  }, {})
}

function detectType (value) {
  if (!value) return null
  else if (moment(value, [moment.ISO_8601], true).isValid()) return 'esriFieldTypeDate'
  else if (typeof value === 'string') return 'esriFieldTypeString'
  else if (typeof value === 'number') return 'esriFieldTypeDouble'
}
