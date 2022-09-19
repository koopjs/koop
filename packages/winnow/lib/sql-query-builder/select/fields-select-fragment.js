function createFieldsSelectFragment (options = {}) {
  const { fields, toEsri } = options;

  if (toEsri) {
    return selectFieldsAsEsriJson(options);
  }

  return selectFieldsAsGeoJson(fields);
}

function selectFieldsAsEsriJson (options) {
  const { fields, dateFields = [], returnIdsOnly, idField = null } = options;
  const delimitedDateFields = dateFields.join(',');
  const includeIdField = shouldIncludeIdField({ returnIdsOnly, fields });
  if (fields) {
    return `selectFieldsToEsriAttributes(properties, geometry, "${fields.join(',')}", "${delimitedDateFields}", "${includeIdField}", "${idField}") as attributes`;
  }
  return `toEsriAttributes(properties, geometry, "${delimitedDateFields}", "${includeIdField}", "${idField}") as attributes`;
}

function shouldIncludeIdField ({ returnIdsOnly, fields }) {
  if (returnIdsOnly || !fields || fields.includes('OBJECTID')) return true;
  return false;
}

function selectFieldsAsGeoJson (fields) {
  if (fields) {
    return `selectFields(properties, "${fields.join(',')}") as properties`;
  }
  return 'type, properties as properties';
}

module.exports = createFieldsSelectFragment;
