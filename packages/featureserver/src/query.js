'use strict'
const Templates = require('./templates')
const Winnow = require('winnow')
const Utils = require('./utils.js')
const _ = require('lodash')

module.exports = query

/**
 * processes params based on query params
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function query (data, params) {
  // TODO how do I support passing in the actual values in a more reasonable way
  if (params.returnCountOnly && data.count) return {count: data.count}
  let geomType
  const queryParams = coerceQuery(params)
  geomType = Utils.setGeomType(data.features[0])
  queryParams.toEsri = true
  const queriedData = Winnow.query(data, queryParams)

  // TODO this should happen within winnow
  // add objectIds as long as this is not a stats request
  if (!queryParams.outStatistics) {
    console.log(queryParams)
    queriedData.features = queriedData.features.map((f, i) => {
      f.attributes.OBJECTID = i
      return f
    })
  }

  // options.objectIds works alongside returnCountOnly but not statistics
  if (queryParams.objectIds && !queryParams.outStatistics) {
    let oids = typeof queryParams.objectIds === 'string' ? queryParams.objectIds.split(',') : queryParams.objectIds
    oids = oids.map(i => { return parseInt(i, 10) })
    queriedData.features = queriedData.features.filter(f => {
      return oids.indexOf(f.attributes.OBJECTID) > -1
    })
  }

  if (queryParams.returnCountOnly) {
    return { count: queriedData.features.length }
  } else if (queryParams.returnIdsOnly) {
    return idsOnly(queriedData)
  } else if (queryParams.outStatistics) {
    return queryStatistics(queriedData, queryParams)
  } else {
    return queryFeatures(queriedData, queryParams, geomType)
  }
}

function queryFeatures (data, queryParams, geomType) {
  let json = Templates.render('features', data, queryParams)
  if (!data.features || !data.features.length) return json
  json = Object.assign(json, geomType)

  return json
}

function queryStatistics (data, queryParams) {
  // This little dance is in place because the stat response from Winnow is different
  // TODO make winnow come out as expected
  // or move this into templates.render
  const statResponse = {}
  const features = Array.isArray(statResponse) ? _.cloneDeep(data) : [_.cloneDeep(data)]
  statResponse.features = features.map(row => {
    return {attributes: row}
  })
  const json = Templates.render('statistics', statResponse, queryParams)
  return json
}

function idsOnly (data) {
  return data.features.reduce((resp, f) => {
    resp.objectIds.push(f.attributes.OBJECTID)
    return resp
  }, { objectIdField: 'OBJECTID', objectIds: [] })
}

/**
 * Coorces true/false strings to boolean
 *
 * @param {object} params - query parameters from the fs request
 * @return {object} modified params
 */
function coerceQuery (params) {
  Object.keys(params).forEach(param => {
    if (params[param] === 'false') params[param] = false
    else if (params[param] === 'true') params[param] = true
  })
  return params
}
