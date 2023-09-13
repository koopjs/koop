const _ = require('lodash');
const {
  ObjectIdField,
  FieldFromKeyValue,
  FieldFromFieldDefinition,
  ObjectIdFieldFromDefinition
} = require('./field-classes');
const logManager = require('../../log-manager');

class Fields {
  static normalizeOptions (inputOptions) {
    const {
      features,
      metadata: {
        fields,
        idField
      } = {},
      attributeSample,
      ...options
    } = inputOptions;

    return {
      idField: options.idField || idField,
      fieldDefinitions: options.fieldDefinitions || options.fields || fields,
      attributeSample: attributeSample || getAttributeSample(features, attributeSample),
      ...options
    };
  }

  constructor (options = {}) {
    const {
      fieldDefinitions,
      idField,
      attributeSample = {}
    } = options;

    if (shouldWarnAboutMissingIdFieldDefinition(idField, fieldDefinitions)) {
      logManager.logger.debug(`provider's "idField" is set to ${idField}, but this field is not found in field-definitions`);
    }

    const normalizedIdField = idField || 'OBJECTID';

    this.fields = fieldDefinitions
      ? setFieldsFromDefinitions(fieldDefinitions, normalizedIdField)
      : setFieldsFromProperties(attributeSample, normalizedIdField);
  }
}

function getAttributeSample (features) {
  return _.get(features, '[0].properties') || _.get(features, '[0].attributes', {});
}

function shouldWarnAboutMissingIdFieldDefinition (idField, fieldDefinitions) {
  if (!idField || !fieldDefinitions) {
    return;
  }

  const fieldNames = fieldDefinitions.map(field => field.name);

  return !fieldNames.includes(idField);
}

function setFieldsFromDefinitions (fieldDefinitions, idField) {
  const fields = fieldDefinitions
    .filter(fieldDefinition => fieldDefinition.name !== idField)
    .map(fieldDefinition => {
      return new FieldFromFieldDefinition(fieldDefinition);
    });

  const idFieldDefinition = getIdFieldDefinition(fieldDefinitions, idField);
  fields.unshift(new ObjectIdFieldFromDefinition(idFieldDefinition));
  return fields;
}

function setFieldsFromProperties (propertiesSample, idField) {
  const fieldNames = Object.keys(propertiesSample);
  const simpleFieldNames = fieldNames.filter(name => name !== idField);

  const fields = simpleFieldNames.map((key) => {
    return new FieldFromKeyValue(key, propertiesSample[key]);
  });

  fields.unshift(new ObjectIdField(idField));

  return fields;
}

function getIdFieldDefinition (fieldDefinitions, idField) {
  const idFieldDefinition = fieldDefinitions.find(definition => {
    return definition.name === idField;
  });

  if (idFieldDefinition) {
    return idFieldDefinition;
  }

  return { name: 'OBJECTID' };
}

module.exports = Fields;
