const _ = require('lodash');

const typeLookup = {
  esriFieldTypeOID: 'uintValue',
  esriFieldTypeInteger: 'sintValue',
  esriFieldTypeSmallInteger: 'sintValue',
  esriFieldTypeString: 'stringValue',
  esriFieldTypeDouble: 'doubleValue',
  esriFieldTypeDate: 'sint64Value',
  esriFieldTypeGlobalID: 'stringValue',
};

function transformToPbfAttributes(attributes, fieldMap) {
  return _.chain(attributes)
    .entries(attributes)
    .map(([key, value]) => ({
      name: key,
      value,
    }))
    .orderBy(['name'],['asc'])
    .map(({ name, value }) => {
      const type = fieldMap[name];
      const pbfType = typeLookup[type];
      return { [pbfType]: value };
    })
    .value();
}

module.exports = {
  transformToPbfAttributes
};
