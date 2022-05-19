const _ = require('lodash')
const { filterAndTransform } = require('./filter-and-transform')
const { logWarnings } = require('./log-warnings')
const { renderFeaturesResponse } = require('./render-features')
const { renderStatisticsResponse } = require('./render-statistics')
const { renderPrecalculatedStatisticsResponse } = require('./render-precalculated-statistics')
const { renderCountAndExtentResponse } = require('./render-count-and-extent')
const { getGeometryTypeFromGeojson } = require('../helpers')

function query (json, requestParams = {}) {
  const {
    features,
    filtersApplied: {
      all: skipFiltering
    } = {}
  } = json

  const { f: requestedFormat } = requestParams

  if (shouldRenderPrecalculatedData(json, requestParams)) {
    return renderPrecalculatedData(json, requestParams)
  }

  const data = (skipFiltering || !features) ? json : filterAndTransform(json, requestParams)

  if (shouldLogWarnings()) {
    logWarnings(data, requestParams.f)
  }

  if (requestedFormat === 'geojson') {
    return {
      type: 'FeatureCollection',
      features: data.features
    }
  }

  return renderGeoservicesResponse(data, {
    ...requestParams,
    attributeSample: _.get(json, 'features[0].properties'),
    geometryType: getGeometryTypeFromGeojson(json)
  })
}

function shouldRenderPrecalculatedData ({ statistics, count, extent }, { returnCountOnly, returnExtentOnly }) {
  if (statistics) {
    return true
  }

  if (returnCountOnly === true && count !== undefined && returnExtentOnly === true && extent) {
    return true
  }

  if (returnCountOnly === true && count !== undefined && !returnExtentOnly) {
    return true
  }

  if (returnExtentOnly === true && extent && !returnCountOnly) {
    return true
  }

  return false
}

function renderPrecalculatedData (data, {
  returnCountOnly,
  returnExtentOnly,
  outStatistics,
  groupByFieldsForStatistics
}) {
  const { statistics, count, extent } = data

  if (statistics) {
    return renderPrecalculatedStatisticsResponse(data, { outStatistics, groupByFieldsForStatistics })
  }

  const retVal = {}

  if (returnCountOnly) {
    retVal.count = count
  }

  if (returnExtentOnly) {
    retVal.extent = extent
  }

  return retVal
}

function shouldLogWarnings () {
  return process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress'
}

function renderGeoservicesResponse (data, params = {}) {
  const {
    returnCountOnly,
    returnExtentOnly,
    returnIdsOnly,
    outSR
  } = params

  if (returnCountOnly || returnExtentOnly) {
    return renderCountAndExtentResponse(data, {
      returnCountOnly,
      returnExtentOnly,
      outSR
    })
  }

  if (returnIdsOnly) {
    return renderIdsOnlyResponse(data)
  }

  if (data.statistics) {
    return renderStatisticsResponse(data, params)
  }

  return renderFeaturesResponse(data, params)
}

function renderIdsOnlyResponse ({ features = [], metadata = {} }) {
  const objectIdFieldName = metadata.idField || 'OBJECTID'

  const objectIds = features.map(({ attributes }) => {
    return attributes[objectIdFieldName]
  })

  return {
    objectIdFieldName,
    objectIds
  }
}

module.exports = query
