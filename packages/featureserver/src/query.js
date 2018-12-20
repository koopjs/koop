const Winnow = require('winnow')
const { renderFeatures, renderStatistics, renderStats } = require('./templates')
const Utils = require('./utils')
const _ = require('lodash')

module.exports = query

/**
 * processes params based on query params
 *
 * @param {object} data
 * @param {object} params
 */
function query (data, params = {}) {
  // TODO clean up this series of if statements
  const filtersApplied = data.filtersApplied || {}
  const options = _.cloneDeep(params)
  const hasIdField = _.has(data, 'metadata.idField')

  if (filtersApplied.projection || options.returnGeometry === false) delete options.outSR
  if (filtersApplied.geometry) delete options.geometry
  if (filtersApplied.where || options.where === '1=1') delete options.where
  if (filtersApplied.offset) delete options.resultOffset
  if (filtersApplied.limit) {
    delete options.resultRecordCount
    delete options.limit
  }
  if (data.statistics) return renderStats(data)
  if (options.returnCountOnly && data.count !== undefined) return { count: data.count }

  if (options.f !== 'geojson') options.toEsri = true
  const queriedData = filtersApplied.all ? data : Winnow.query(data, options)

  // Warnings
  if (process.env.NODE_ENV !== 'production' && process.env.KOOP_WARNINGS !== 'suppress') {
    // ArcGIS client warnings
    if (options.toEsri && !hasIdField) {
      console.warn(`WARNING: requested provider has no "idField" assignment. This can cause errors in ArcGIS clients`)
    } else if (options.toEsri && data.metadata.idField.toLowerCase() === 'objectid' && data.metadata.idField !== 'OBJECTID') {
      console.warn(`WARNING: requested provider's "idField" is a mixed-case version of "OBJECTID". This can cause errors in ArcGIS clients`)
    }

    // Compare provider metadata fields to feature properties
    if (_.has(data, 'metadata.fields') && _.has(data, 'features[0].properties')) {
      warnOnMetadataFieldDiscrepencies(data.metadata.fields, data.features[0].properties)
    }
  }
  if (params.f === 'geojson') return { type: 'FeatureCollection', features: queriedData.features }
  else return geoservicesPostQuery(data, queriedData, params)
}

/**
 * Format the queried data according to request parameters
 * @param {object} data - full dataset
 * @param {object} queriedData - subset of data with query applied
 * @param {object} params
 */
function geoservicesPostQuery (data, queriedData, params) {
  const oidField = _.get(data, 'metadata.idField') || 'OBJECTID'

  // Specific set of objectIds were requested (options.objectIds works alongside returnCountOnly
  // but not out-statistics); filter accordingly
  if (params.objectIds && !params.outStatistics) {
    let oids

    // Normalize the objectIds param as an array of integers
    if (Array.isArray(params.objectIds)) oids = params.objectIds
    else if (typeof params.objectIds === 'string') oids = params.objectIds.split(',')
    else if (typeof params.objectIds === 'number') oids = [params.objectIds]
    else {
      const error = new Error(`Invalid "objectIds" parameter.`)
      error.code = 400
      throw error
    }
    oids = oids.map(i => {
      return parseInt(i)
    })

    // Filter features to those with matching ids
    queriedData.features = queriedData.features.filter(f => {
      return oids.includes(f.attributes[oidField])
    })
  }

  // Format the response according to the request parameters
  if (params.returnCountOnly) {
    return { count: queriedData.features.length }
  } else if (params.returnIdsOnly) {
    return idsOnly(queriedData, data.metadata)
  } else if (params.outStatistics) {
    return queryStatistics(queriedData, params)
  } else {
    params.spatialReference = params.outSR
    params.attributeSample = data.features[0] && data.features[0].properties
    params.geometryType = Utils.getGeomType(data)
    return renderFeatures(queriedData, params)
  }
}

/**
 * Format a response for an ids-only request
 * @param {object} data
 */
function idsOnly (data) {
  const oidField = _.get(data, 'metadata.idField') || 'OBJECTID'
  const response = { objectIdField: oidField, objectIds: [] }
  response.objectIds = data.features.map(f => { return f.attributes[oidField] })
  return response
}

function queryStatistics (data, params) {
  // This little dance is in place because the stat response from Winnow is different
  // TODO make winnow come out as expected
  // or move this into templates.render
  const statResponse = {
    type: 'FeatureCollection',
    features: []
  }
  const features = Array.isArray(data) ? data : [data]
  statResponse.features = features.map(row => {
    return { attributes: row }
  })
  return renderStatistics(statResponse, params)
}

/**
 * Compare fields generated from metadata to properties of a data feature.
 * Warn if differences discovered
 * @param {*} metadataFields
 * @param {*} properties
 */
function warnOnMetadataFieldDiscrepencies (metadataFields, featureProperties) {
  // build a comparison collection from the data samples properties
  const featureFields = Object.keys(featureProperties).map(name => {
    return { name, type: Utils.detectType(featureProperties[name]) }
  })

  // compare metadata to feature properties; identifies fields defined in metadata that are not found in feature properties
  // or that have a metadata type definition inconsistent with feature property's value
  metadataFields.filter(field => {
    // look for a defined field in the features properties
    let featureField = _.find(featureFields, ['name', field.name]) || _.find(featureFields, ['name', field.alias])
    if (!featureField || (field.type !== featureField.type && !(field.type === 'Date' && featureField.type === 'Integer') && !(field.type === 'Double' && featureField.type === 'Integer'))) {
      console.warn(`WARNING: requested provider's metadata field "${field.name} (${field.type})" not found in feature properties)`)
    }
  })

  // compare feature properties to metadata fields; identifies fields found on feature that are not defined in metadata field array
  featureFields.filter(field => {
    const noNameMatch = _.find(metadataFields, ['name', field.name])
    const noAliasMatch = _.find(metadataFields, ['alias', field.name])

    // Exclude warnings on feature fields named OBJECTID because OBJECTID may have been added by winnow in which case it should not be in the metadata fields array
    if (!(noNameMatch || noAliasMatch) && field.name !== 'OBJECTID') {
      console.warn(`WARNING: requested provider's features have property "${field.name} (${field.type})" that was not defined in metadata fields array)`)
    }
  })
}
