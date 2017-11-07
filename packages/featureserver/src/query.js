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
  if (filtersApplied.projection) delete options.outSR
  if (filtersApplied.geometry) delete options.geometry
  if (filtersApplied.where || options.where === '1=1') delete options.where
  if (filtersApplied.offset) delete options.resultOffset
  if (data.statistics) return renderStats(data)
  if (options.returnCountOnly && data.count) return { count: data.count }

  if (options.f !== 'geojson') options.toEsri = true
  const queriedData = Winnow.query(data, options)

  if (params.f === 'geojson') return { type: 'FeatureCollection', features: queriedData.features }
  else return geoservicesPostQuery(data, queriedData, params)
}

function geoservicesPostQuery (data, queriedData, params) {
  // options.objectIds works alongside returnCountOnly but not statistics
  const oidField = (data.metadata && data.metadata.idField) || 'OBJECTID'
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
  const oidField = options.idField || 'OBJECTID'
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
