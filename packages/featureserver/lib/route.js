const joi = require('joi')
const geojsonhint = require('geojson-validation')
const chalk = require('chalk')
const layerInfo = require('./layer-metadata')
const query = require('./query')
const queryRelatedRecords = require('./queryRelatedRecords.js')
const generateRenderer = require('./generate-renderer')
const restInfo = require('./rest-info-route-handler')
const serverInfo = require('./server-info-route-handler')
const layersInfo = require('./layers-metadata')
const relationshipsInfo = require('./relationships-info-route-handler')
const responseHandler = require('./response-handler')

const queryParamSchema = joi.object({
  limit: joi.number().optional(),
  resultRecordCount: joi.number().optional()
}).unknown()

const geojsonMetadataSchema = joi.object({
  maxRecordCount: joi.number().prefs({ convert: false }).optional().default(2000)
}).unknown()

module.exports = function route (req, res, geojson = {}, options = {}) {
  const {
    params: {
      method
    },
    url,
    originalUrl,
    path
  } = req

  const [route] = (url || originalUrl).split('?')

  if (shouldValidateGeojson()) {
    validateGeojson(geojson, path)
  }

  try {
    const metadata = validateGeojsonMetadata(geojson.metadata)
    const queryParams = validateAndCoerceQueryParams(req.query, metadata)

    geojson = { ...geojson, metadata }
    req = { ...req, query: queryParams }
    let result

    if (method) {
      result = handleMethodRequest({ method, geojson, req })
    } else if (isRestInfoRequest(route)) {
      result = restInfo(geojson, req)
    } else if (isServerMetadataRequest(route)) {
      result = serverInfo(geojson, req)
    } else if (isLayersMetadataRequest(route)) {
      result = layersInfo(geojson, queryParams)
    } else if (isRelationshipsMetadataRequest(route)) {
      result = relationshipsInfo(geojson, queryParams)
    } else if (isLayerMetadataRequest(route)) {
      result = layerInfo(geojson, req)
    } else {
      const error = new Error('Not Found')
      error.code = 404
      throw error
    }

    return responseHandler(req, res, 200, result)
  } catch (error) {
    if (process.env.KOOP_LOG_LEVEL === 'debug') console.trace(error)
    return responseHandler(req, res, error.code || 500, { error: error.message })
  }
}

function handleMethodRequest ({ method, geojson, req }) {
  if (method === 'query') {
    return query(geojson, req.query)
  } else if (method === 'queryRelatedRecords') {
    return queryRelatedRecords(geojson, req.query)
  } else if (method === 'generateRenderer') {
    return generateRenderer(geojson, req.query)
  } else if (method === 'info') {
    return layerInfo(geojson, req)
  }
  const error = new Error('Method not supported')
  error.code = 400
  throw error
}

function shouldValidateGeojson () {
  const {
    KOOP_LOG_LEVEL,
    KOOP_DISABLE_GEOJSON_VALIDATION
  } = process.env
  return KOOP_LOG_LEVEL === 'debug' && KOOP_DISABLE_GEOJSON_VALIDATION !== 'true'
}

function validateGeojson (geojson, path) {
  const geojsonErrors = geojsonhint.valid(geojson, true)
  if (geojsonErrors.length > 0) {
    console.log(chalk.yellow(`WARNING: source data for ${path} contains invalid GeoJSON; ${geojsonErrors[0]}`))
  }
}

function validateGeojsonMetadata (metadata = {}) {
  const { error, value } = geojsonMetadataSchema.validate(metadata)
  if (error) {
    error.code = 500
    throw error
  }
  return value
}

function validateAndCoerceQueryParams (queryParams, { maxRecordCount }) {
  const { error, value: query } = queryParamSchema.validate(queryParams)

  if (error) {
    error.code = 400
    throw error
  }

  const { limit, resultRecordCount } = query
  query.limit = limit || resultRecordCount || maxRecordCount
  return Object.keys(query).reduce((acc, key) => {
    const value = query[key]
    if (value === 'false') acc[key] = false
    else if (value === 'true') acc[key] = true
    else {
      acc[key] = tryParse(value)
    }
    return acc
  }, {})
}

function tryParse (value) {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

function isRestInfoRequest (url) {
  return /\/rest\/info$/i.test(url)
}

function isServerMetadataRequest (url) {
  return /\/FeatureServer$/i.test(url) || /\/FeatureServer\/info$/i.test(url) || /\/FeatureServer\/($|\?)/.test(url)
}

function isLayersMetadataRequest (url) {
  return /\/FeatureServer\/layers$/i.test(url)
}

function isRelationshipsMetadataRequest (url) {
  return /\/FeatureServer\/relationships$/i.test(url)
}

function isLayerMetadataRequest (url) {
  return /\/FeatureServer\/\d+$/i.test(url) || /\/FeatureServer\/\d+\/info$/i.test(url) || /\/FeatureServer\/\d+\/$/.test(url)
}
