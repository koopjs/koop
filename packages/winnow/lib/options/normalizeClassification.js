function normalizeClassification (options) {
  if (options.classification) return options.classification // TODO: ? normalize standard classification
  else if (options.classificationDef) return normalizeGeoservicesClassBreaks(options)
  else return undefined
}

function normalizeGeoservicesClassBreaks (options) {
  const inClass = options.classificationDef
  if (inClass.type === 'classBreaksDef') {
    return {
      type: 'classes',
      field: inClass.classificationField,
      method: normalizeGeoservicesMethod(inClass.classificationMethod),
      stddev_intv: inClass.standardDeviationInterval || undefined,
      breakCount: inClass.breakCount,
      normType: normalizeGeoservicesNorm(inClass.normalizationType),
      normField: inClass.normalizationField ? inClass.normalizationField : undefined
    }
  } else if (inClass.type === 'uniqueValueDef') {
    return {
      type: 'unique',
      fields: inClass.uniqueValueFields
    }
  } else throw new Error('Input classification type invalid:' + inClass.type)
}

function normalizeGeoservicesMethod (method) {
  switch (method) {
    case 'esriClassifyEqualInterval': return 'equalInterval'
    case 'esriClassifyNaturalBreaks': return 'naturalBreaks'
    case 'esriClassifyQuantile': return 'quantile'
    case 'esriClassifyGeometricalInterval': return 'geomInterval'
    case 'esriClassifyStandardDeviation': return 'stddev'
    default: return undefined
  }
}

function normalizeGeoservicesNorm (normalization) {
  switch (normalization) {
    case 'esriNormalizeByField': return 'field'
    case 'esriNormalizeByLog': return 'log'
    case 'esriNormalizeByPercentOfTotal': return 'percent'
    default: return undefined
  }
}

module.exports = { normalizeClassification }
