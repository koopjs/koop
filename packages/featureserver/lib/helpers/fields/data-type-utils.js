const _ = require('lodash')
const {
  isValidISODateString,
  isValidDate
} = require('iso-datestring-validator')

function getDataTypeFromValue (value) {
  if (_.isNumber(value)) {
    return Number.isInteger(value) ? 'Integer' : 'Double'
  }

  if (isDate(value)) {
    return 'Date'
  }

  return 'String'
}

function isDate (value) {
  return value instanceof Date || ((typeof value === 'string') && (isValidDate(value) || isValidISODateString(value)))
}

module.exports = {
  getDataTypeFromValue,
  isDate
}
