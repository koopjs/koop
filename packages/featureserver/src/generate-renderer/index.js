const Winnow = require('../../../winnow');
const { getGeometryTypeFromGeojson } = require('../helpers');
const validateClassificationDefinition = require('./validate-classification-definition');
const { createColorRamp } = require('./color-ramp');
const { createSymbol } = require('./create-symbol');

module.exports = generateRenderer;

function generateRenderer (data = {}, options = {}) {
  const { statistics = {}, features } = data;
  const geometryType = getGeometryTypeFromGeojson(data);
  const { classificationDef = {} } = options;

  if (statistics.classBreaks) {
    return generateRendererFromPrecalculatedStatistics(statistics, { classificationDef, geometryType });
  }

  if (features) {
    return generateRendererFromFeatures(data, { ...options, geometryType });
  }

  return {};
}

function generateRendererFromPrecalculatedStatistics (statistics, options) {
  const { classificationDef, geometryType = 'esriGeometryPoint' } = options;
  const { colorRamp: colorRampConfig = {}, baseSymbol } = classificationDef;
  const classification = statistics.classBreaks.sort((a, b) => a[0] - b[0]);

  validateClassificationDefinition(classificationDef, geometryType, classification);

  const colorRamp = createColorRamp({ classification, ...colorRampConfig });
  const symbolCollection = colorRamp.map((color) => {
    return createSymbol(baseSymbol, color, geometryType);
  });
  return renderClassBreaks(classification, classificationDef, symbolCollection);
}

function generateRendererFromFeatures (data, params) {
  const { classificationDef, geometryType } = params;

  // TODO: this seems weird; the winnow method is "query" but it's really a very specialized transform (aggregation)
  // consider changes to winnow - this should maybe be a different method
  const classification = Winnow.query(data, params);
  validateClassificationDefinition(classificationDef, geometryType, classification);

  const { colorRamp: colorRampConfig = {}, baseSymbol } = classificationDef;

  const colorRamp = createColorRamp({ classification, ...colorRampConfig });
  const symbolCollection = colorRamp.map((color) => {
    return createSymbol(baseSymbol, color, geometryType);
  });

  if (classificationDef.type === 'classBreaksDef') {
    return renderClassBreaks(classification, classificationDef, symbolCollection);
  }

  // if not 'classBreaksDef', then its unique-values
  return renderUniqueValue(classification, classificationDef, symbolCollection);
}

function renderClassBreaks (breaks, classificationDef, symbolCollection) {
  return {
    type: 'classBreaks',
    field: classificationDef.classificationField || '',
    classificationMethod: classificationDef.classificationMethod || '',
    minValue: breaks[0][0],
    classBreakInfos: createClassBreakInfos(breaks, symbolCollection)
  };
}

function createClassBreakInfos (breaks, symbolCollection) {
  return breaks.map((classBreak, index) => {
    return {
      classMinValue: classBreak[0],
      classMaxValue: classBreak[1],
      label: `${classBreak[0]}-${classBreak[1]}`,
      description: '',
      symbol: symbolCollection[index]
    };
  });
}

function renderUniqueValue (classification, classificationDef, symbolCollection) {
  const { uniqueValueFields, fieldDelimiter } = classificationDef;
  return {
    type: 'uniqueValue',
    field1: uniqueValueFields[0],
    field2: '',
    field3: '',
    fieldDelimiter,
    defaultSymbol: {},
    defaultLabel: '',
    uniqueValueInfos: createUniqueValueInfos(
      classification,
      fieldDelimiter,
      symbolCollection
    )
  };
}

function createUniqueValueInfos (
  uniqueValueEntries,
  fieldDelimiter,
  symbolCollection
) {
  return uniqueValueEntries.map((uniqueValue, index) => {
    const value = serializeUniqueValues(uniqueValue, fieldDelimiter);

    return {
      value,
      count: uniqueValue.count,
      label: value,
      description: '',
      symbol: symbolCollection[index]
    };
  });
}

function serializeUniqueValues (uniqueValue, delimiter) {
  const { count, ...rest } = uniqueValue;
  return Object.values(rest).join(delimiter);
}
