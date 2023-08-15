function normalizeClassification({ classification, classificationDef } = {}) {
  if (classification)
    return classification; // TODO: ? normalize standard classification
  else if (classificationDef)
    return normalizeGeoservicesClassBreaks(classificationDef);
  else return undefined;
}

function normalizeGeoservicesClassBreaks(classificationDef) {
  const {
    type,
    classificationField,
    classificationMethod,
    standardDeviationInterval,
    breakCount,
    normalizationType,
    normalizationField,
    uniqueValueFields,
  } = classificationDef;

  if (type === 'classBreaksDef') {
    return {
      type: 'classes',
      field: classificationField,
      method: normalizeClassificationMethod(classificationMethod),
      stddev_intv: standardDeviationInterval || undefined,
      breakCount: breakCount,
      normType: normalizeTranformationMethod(normalizationType),
      normField: normalizationField,
    };
  }

  if (type === 'uniqueValueDef') {
    return {
      type: 'unique',
      fields: uniqueValueFields,
    };
  }

  throw new Error(`Input classification type invalid: ${type}`);
}

function normalizeClassificationMethod(method) {
  switch (method) {
    case 'esriClassifyEqualInterval':
      return 'equalInterval';
    case 'esriClassifyNaturalBreaks':
      return 'naturalBreaks';
    case 'esriClassifyQuantile':
      return 'quantile';
    case 'esriClassifyGeometricalInterval':
      return 'geomInterval';
    case 'esriClassifyStandardDeviation':
      return 'stddev';
    default:
      return method;
  }
}

function normalizeTranformationMethod(method) {
  switch (method) {
    case 'esriNormalizeByField':
      return 'field';
    case 'esriNormalizeByLog':
      return 'log';
    case 'esriNormalizeByPercentOfTotal':
      return 'percent';
    default:
      return method;
  }
}

module.exports = normalizeClassification;
