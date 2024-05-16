const _ = require('lodash');
const { isValidISODateString, isValidDate } = require('iso-datestring-validator');
const dateTimeParser = require('postgres-date');

function getDataTypeFromValue(value) {
  if (_.isNumber(value)) {
    return Number.isInteger(value) ? 'Integer' : 'Double';
  }

  if (isDate(value)) {
    return 'Date';
  }

  return 'String';
}

function isDate(value) {
  return (
    value instanceof Date ||
    (typeof value === 'string' &&
      !!(dateTimeParser(value) || isValidDate(value) || isValidISODate(value)))
  );
}

function isValidISODate(value) {
  // this is required due to RegExp error in in the iso-datestring-validator module
  try {
    return isValidISODateString(value);
  } catch (err) {
    if (err.message.startsWith('Invalid regular expression')) {
      return false;
    }
    throw err;
  }
}

module.exports = {
  getDataTypeFromValue,
  isDate,
};
