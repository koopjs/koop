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
 * @param {function} callback
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

  if (params.f === 'geojson') return { type: 'FeatureCollection', features: queriedData.features }
  else return geoservicesPostQuery(data, queriedData, params)
}

function geoservicesPostQuery (data, queriedData, params) {
  // options.objectIds works alongside returnCountOnly but not statistics
  const oidField = 'OBJECTID'
  if (params.objectIds && !params.outStatistics) {
    let oids

    if (typeof params.objectIds === 'string') oids = params.objectIds.split(',')
    else if (typeof params.objectIds === 'number') oids = [params.objectIds]
    else oids = params.objectIds

    oids = oids.map(i => {
      return parseInt(i)
    })
    queriedData.features = queriedData.features.filter(f => {
      return oids.indexOf(f.attributes[oidField]) > -1
    })
  }

  if (params.returnCountOnly) {
    return { count: queriedData.features.length }
  } else if (params.returnIdsOnly) {
    return idsOnly(queriedData, data.metadata)
  } else if (params.outStatistics) {
    return queryStatistics(queriedData, params)
  } else {
    params.extent = Utils.getExtent(queriedData)
    params.geometryType = Utils.getGeomType(data)
    // TODO should these be calculated using the whole dataset?
    params.spatialReference = params.outSR
    params.attributeSample = data.features[0] && data.features[0].properties
    return renderFeatures(queriedData, params)
  }
}

function idsOnly (data, options = {}) {
  const oidField = 'OBJECTID'
  return data.features.reduce(
    (resp, f) => {
      resp.objectIds.push(f.attributes[oidField])
      return resp
    },
    { objectIdField: oidField, objectIds: [] }
  )
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
  // that have a metadata type definition inconsistent with feature property's value
  metadataFields.filter(field => {
    let featureField = _.find(featureFields, ['name', field.name])
    if (!featureField || (field.type !== featureField.type && !(field.type === 'Date' && featureField.type === 'Integer') && !(field.type === 'Double' && featureField.type === 'Integer'))) {
      console.warn(`WARNING: requested provider's metadata field "${field.name} (${field.type})" not found in feature properties)`)
    }
  })

  // compare feature properties to metadata fields; identifies fields found on feature that are not defined in metadata field array
  featureFields.filter(field => {
    if (!_.find(metadataFields, ['name', field.name])) {
      console.warn(`WARNING: requested provider's features have property "${field.name} (${field.type})" that was not defined in metadata fields array)`)
    }
  })
}
