const _ = require('lodash');
const {
  isValidISODateString,
  isValidDate,
} = require('iso-datestring-validator');
const dateTimeParser = require('postgres-date');

const PROBLEMATIC_STRING_SYMBOLS = ['(', '[', '*', '+', '\\', '?'];

function getDataTypeFromValue (value) {
  if (_.isNumber(value)) {
    return Number.isInteger(value) ? 'Integer' : 'Double';
  }

  if (isDate(value)) {
    return 'Date';
  }

  return 'String';
}

function isDate (value) {
  // this is required due to RegExp error in in the iso-datestring-validator module
  if (typeof value === 'string' && PROBLEMATIC_STRING_SYMBOLS.includes(value.charAt(0))) {
    return false;
  }

  return (value instanceof Date || (typeof value === 'string') && !!(dateTimeParser(value) || isValidDate(value) || isValidISODateString(value)));
}

module.exports = {
  getDataTypeFromValue,
  isDate
};
