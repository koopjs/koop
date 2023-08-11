const { getDataTypeFromValue } = require('../data-type-utils');
const {
  ESRI_FIELD_TYPE_STRING,
  ESRI_FIELD_TYPE_DATE,
  ESRI_FIELD_TYPE_DOUBLE,
} = require('./constants');

function getEsriTypeFromDefinition(typeDefinition = '') {
  switch (typeDefinition.toLowerCase()) {
    case 'double':
      return ESRI_FIELD_TYPE_DOUBLE;
    case 'integer':
      return 'esriFieldTypeInteger';
    case 'date':
      return ESRI_FIELD_TYPE_DATE;
    case 'blob':
      return 'esriFieldTypeBlob';
    case 'geometry':
      return 'esriFieldTypeGeometry';
    case 'globalid':
      return 'esriFieldTypeGlobalID';
    case 'guid':
      return 'esriFieldTypeGUID';
    case 'raster':
      return 'esriFieldTypeRaster';
    case 'single':
      return 'esriFieldTypeSingle';
    case 'smallinteger':
      return 'esriFieldTypeSmallInteger';
    case 'xml':
      return 'esriFieldTypeXML';
    case 'string':
    default:
      return ESRI_FIELD_TYPE_STRING;
  }
}

function getEsriTypeFromValue(value) {
  const dataType = getDataTypeFromValue(value);

  return getEsriTypeFromDefinition(dataType);
}

module.exports = {
  getEsriTypeFromDefinition,
  getEsriTypeFromValue,
};
