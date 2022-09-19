const moment = require('moment');
const DATE_FORMATS = [moment.ISO_8601];

function detectEsriFieldType (value) {
  var type = typeof value;

  if (Number.isInteger(value)) {
    return 'Integer';
  }

  if (type === 'number') {
    return 'Double';
  }

  if (moment(value, DATE_FORMATS, true).isValid()) {
    return 'Date';
  }

  return 'String';
}

module.exports = detectEsriFieldType;
