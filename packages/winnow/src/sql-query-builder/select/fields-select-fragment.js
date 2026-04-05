function createFieldsSelectFragment(options = {}) {
  const { fields, toEsri } = options;

  if (toEsri) {
    return selectFieldsAsEsriJson(options);
  }

  return selectFieldsAsGeoJson(fields);
}

function selectFieldsAsEsriJson(options) {
  const { fields, dateFields = [], returnIdsOnly, idField = null } = options;
  const validatedFields = validateFields(fields);
  const validatedDateFields = validateFields(dateFields);
  const validatedIdField = idField ? validateField(idField) : null;
  const delimitedDateFields = validatedDateFields.join(',');
  const includeIdField = shouldIncludeIdField({ returnIdsOnly, fields: validatedFields });
  if (validatedFields) {
    return `selectFieldsToEsriAttributes(properties, geometry, "${validatedFields.join(',')}", "${delimitedDateFields}", "${includeIdField}", "${validatedIdField}") as attributes`;  // eslint-disable-line
  }
  return `toEsriAttributes(properties, geometry, "${delimitedDateFields}", "${includeIdField}", "${validatedIdField}") as attributes`;   // eslint-disable-line
}

function shouldIncludeIdField({ returnIdsOnly, fields }) {
  if (returnIdsOnly || !fields || fields.includes('OBJECTID')) return true;
  return false;
}

function validateFields(fields) {
  if (!fields) return fields;
  return fields.map(validateField);
}

function validateField(field) {
  if (!/^[A-Za-z0-9_]+$/.test(field)) {
    throw new Error('Invalid field');
  }
  return field;
}

function selectFieldsAsGeoJson(fields) {
  const validatedFields = validateFields(fields);
  if (validatedFields) {
    return `selectFields(properties, "${validatedFields.join(',')}") as properties`;
  }
  return 'type, properties as properties';
}

module.exports = createFieldsSelectFragment;
