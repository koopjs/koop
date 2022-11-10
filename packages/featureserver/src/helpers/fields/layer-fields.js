const Fields = require('./fields');

class LayerFields extends Fields {
  static create (inputOptions) {
    const options = Fields.normalizeOptions(inputOptions);
    return new LayerFields(options);
  }

  constructor (options) {
    super(options);

    return this.fields.map(field => {
      const { editable = false, nullable = false } = findDefinition(field.name, options.fieldDefinitions);
      field.setEditable(editable).setNullable(nullable);
      return field;
    });
  }
}

function findDefinition (fieldName, fieldDefinitions = []) {
  return fieldDefinitions.find(definition => {
    return definition.name === fieldName;
  }) || {};
}
module.exports = LayerFields;
