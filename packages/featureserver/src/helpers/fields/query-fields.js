const Fields = require('./fields');

class QueryFields extends Fields {
  static create (inputOptions = {}) {
    const options = Fields.normalizeOptions(inputOptions);
    return new QueryFields(options);
  }

  constructor (options = {}) {
    super(options);

    const {
      outFields
    } = options;

    if (outFields && outFields !== '*') {
      return filterByOutfields(outFields, this.fields);
    }

    return this.fields;
  }
}

function filterByOutfields (outFields, fields) {
  const outFieldNames = outFields.split(/\s*,\s*/);
  return fields.filter(field => {
    return outFieldNames.includes(field.name);
  });
}

module.exports = QueryFields;
