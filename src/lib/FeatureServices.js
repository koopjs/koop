'use strict'
/**
 * utility functions for dealing with feature services
 */

var path = require('path')
var moment = require('moment')
var terraformerParser = require('terraformer-arcgis-parser')
var esriExtent = require('esri-extent')
var query = require('./Query')

/** @type {Object} maps common type names to esri type names */
var fieldTypes = {
  'string': 'esriFieldTypeString',
  'integer': 'esriFieldTypeInteger',
  'date': 'esriFieldTypeDate',
  'datetime': 'esriFieldTypeDate',
  'float': 'esriFieldTypeDouble'
}

/** @type {Array} accepted date formats used by moment.js */
var formats = [
  moment.ISO_8601
]

const renderers = {
  polygon: require(path.join(__dirname, 'templates', 'renderers', 'polygon.json')),
  line: require(path.join(__dirname, 'templates', 'renderers', 'line.json')),
  point: require(path.join(__dirname, 'templates', 'renderers', 'point.json'))
}

const templates = {
  featureLayer: require(path.join(__dirname, 'templates', 'featureLayer.json')),
  featureService: require(path.join(__dirname, 'templates', 'featureService.json')),
  featureSet: require(path.join(__dirname, 'templates', 'featureSet.json'))
}

/**
 * returns esri field type based on type of value passed
 *
 * @param {*} value - object to evaluate
 * @return {string} esri field type
 */
function fieldType (value) {
  var type = typeof value

  if (type === 'number') {
    type = isInt(value) ? 'integer' : 'float'
  }

  return fieldTypes[type]
}

/**
 * is the value an integer?
 *
 * @param  {Number} value
 * @return {Boolean} is it an integer
 */
function isInt (value) {
  return Math.round(value) === value
}

/**
 * builds esri json fields object from geojson properties
 *
 * @param  {object} props
 * @param  {string} idField
 * @param  {array} list
 * @return {object} fields
 */
function fields (props, idField, list) {
  var fields = []
  var keys = Object.keys(props)
  var type, fieldList

  if (list) {
    fieldList = list
    // if our keys and list are diff length we need to add an OID key
    // also make sure no ID or OBJECID is already included
    if (keys.length > list.length && (list.indexOf('OBJECTID') === -1 || list.indexOf('id') === -1)) {
      fieldList.push('OBJECTID')
    }
  } else {
    fieldList = Object.keys(props)
  }

  fieldList.forEach(function (key, i) {
    if (key === 'OBJECTID' && !idField) {
      idField = key
    }

    type = ((idField && key === idField) ? 'esriFieldTypeOID' : (fieldType(props[key]) || 'esriFieldTypeString'))

    // check for a date; set type
    if (typeof props[key] === 'string' && moment(props[key], formats, true).isValid()) {
      type = 'esriFieldTypeDate'
    }

    if (type) {
      var fld = {
        name: key,
        type: type,
        alias: key
      }

      if (type === 'esriFieldTypeString') {
        fld.length = 128
      }

      fields.push(fld)
    }
  })

  if (!idField) {
    idField = 'id'
    fields.push({
      name: idField,
      type: 'esriFieldTypeOID',
      alias: idField
    })
  }

  return {
    oidField: idField,
    fields: fields
  }
}

/**
 * loads a template json file and attaches fields
 *
 * @param {string} tmpl
 * @param {object} data
 * @param {object} params
 * @return {object} template
 */
function processTemplate (tmpl, data, params) {
  const template = templates[tmpl]

  if (tmpl !== 'featureService') {
    const fieldObj = fields(data.features[0].properties, params.idField, (data.info) ? data.info.fields : null)
    template.fields = fieldObj.fields
    if (template.objectIdFieldName) template.objectIdFieldName = fieldObj.oidField
    else template.objectIdField = fieldObj.oidField
  }

  return template
}

/**
 * set esri geometry type of a feature layer based on geojson type
 *
 * @param {object} json
 * @param {object} feature
 */
function setGeomType (json, feature) {
  var isPolygon = feature && feature.geometry && (feature.geometry.type.toLowerCase() === 'polygon' || feature.geometry.type.toLowerCase() === 'multipolygon')
  var isLine = feature && feature.geometry && (feature.geometry.type.toLowerCase() === 'linestring' || feature.geometry.type.toLowerCase() === 'multilinestring')

  if (isPolygon) {
    json.geometryType = 'esriGeometryPolygon'
    json.drawingInfo.renderer = renderers['polygon']
  } else if (isLine) {
    json.geometryType = 'esriGeometryPolyline'
    json.drawingInfo.renderer = renderers['line']
  } else {
    json.geometryType = 'esriGeometryPoint'
    json.drawingInfo.renderer = renderers['point']
  }

  return json
}

/**
 * returns the feature service metadata (/FeatureServer and /FeatureServer/0)
 *
 * @param {object} data
 * @param {number} layer
 * @param {object} params
 * @param {function} callback
 */
function info (geojson, layer, params, callback) {
  let json

  if (layer !== undefined) json = layerInfo(geojson, params, layer)
  else json = serviceInfo(geojson, params, layer)

  send(json, params, callback)
}

function layerInfo (geojson, params, layer) {
  let json = processTemplate('featureLayer', geojson, params)
  json.name = geojson.name || 'Layer ' + layer

  // set the geometry based on the first feature
  // TODO: could clean this up or use a flag in the url to pull out feature of specific type like nixta
  json = setGeomType(json, (geojson && geojson.features) ? geojson.features[0] : null)

  json.fullExtent = json.initialExtent = json.extent = geojson.extent || esriExtent(geojson.features)

  if (isTable(json, geojson)) json.type = 'Table'

  return json
}

function serviceInfo (geojson, params, layer) {
  // no layer, send the service json
  let json = processTemplate('featureService', geojson, params)

  json.fullExtent = json.initialExtent = json.extent = geojson.extent || esriExtent(geojson)
  const lyr = {
    id: 0,
    name: geojson.name || 'layer 1',
    parentLayerId: -1,
    defaultVisibility: true,
    subLayerIds: null,
    minScale: 99999.99,
    maxScale: 0
  }
  if (isTable(json, geojson)) json.tables[0] = lyr
  else json.layers[0] = lyr
  return json
}

/**
 * if we have no extent, but we do have features, then it should be Table
 *
 * @param {object} json
 * @param {object} data
 * @return {boolean}
 */
function isTable (json, data) {
  var noExtent = (!json.fullExtent.xmin && !json.fullExtent.ymin) || json.fullExtent.xmin === Infinity
  var hasFeatures = data.features || data[0].features
  return !!(noExtent && hasFeatures)
}

/**
 * deals with `/layers` method call
 * TODO: support many layers
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function layers (data, params, callback) {
  var layerJson, json

  if (!data.length) {
    layerJson = processTemplate('featureLayer.json', data, params)
    layerJson.extent = layerJson.fullExtent = layerJson.initialExtent = esriExtent(data.features)
    json = { layers: [layerJson], tables: [] }

    send(json, params, callback)
  } else {
    json = { layers: [], tables: [] }

    data.forEach(function (layer, i) {
      layerJson = processTemplate('featureLayer.json', layer, params)
      layerJson.id = i
      layerJson.extent = layerJson.fullExtent = layerJson.initialExtent = esriExtent(layer.features)
      json.layers.push(layerJson)
    })

    send(json, params, callback)
  }
}

/**
 * processes params based on query params
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function queryData (data, params, callback) {
  // only deal with single layer datasets
  if (data.length) {
    data = data[0]
  }

  const queryParams = coerceQuery(params)

  if (queryParams.objectIds) {
    queryIds(data, params, function (json) {
      send(json, params, callback)
    })
  } else if (queryParams.returnCountOnly && data.count) {
    callback(null, { count: data.count })
  } else {
    var json = processTemplate('featureSet', data, queryParams)

    if (!data.features || !data.features.length) {
      send(json, queryParams, callback)
    } else {
      // geojson to esri json
      if (!data.type) {
        data.type = 'FeatureCollection'
      }

      if (data.features[0] && data.features[0].properties.OBJECTID) {
        json.features = terraformerParser.convert(data)
      } else {
        json.features = terraformerParser.convert(data, { idAttribute: 'id' })
      }

      if (json.features && json.features.length && (json.features[0].geometry && json.features[0].geometry.rings)) {
        json.geometryType = 'esriGeometryPolygon'
      } else if (json.features && json.features.length && (json.features[0].geometry && json.features[0].geometry.paths)) {
        json.geometryType = 'esriGeometryPolyline'
      } else {
        json.geometryType = 'esriGeometryPoint'
      }

      // create an id field if not existing
      if (!queryParams.idField) {
        json.features.forEach(function (f, i) {
          if (!f.attributes.id && !f.attributes.OBJECTID) {
            f.attributes.id = i + 1
          }
        })
      }

      // send back to controller
      send(json, params, callback)
    }
  }
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

/**
 * query features by field ID
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function queryIds (data, params, callback) {
  var json = processTemplate('featureSet', data, params)
  var allFeatures = terraformerParser.convert(data)
  var features = []

  // split the id list on comma, we need an array
  params.objectIds = params.objectIds.split(',')

  allFeatures.forEach(function (f, i) {
    var id
    if (!params.idField) {
      // Assign a new id, create an 'id'
      id = i + 1
      if (!f.attributes.id) {
        f.attributes.id = id
      }
    } else {
      id = f.attributes[params.idField]
    }
    if (params.objectIds.indexOf(id + '') > -1) {
      features.push(f)
    }
  })
  json.features = features
  if (callback) {
    callback(json)
  }
}

/**
 * filter the data based on any given query params
 *
 * @param {object} data
 * @param {object} params
 * @param {function} callback
 */
function send (json, params, callback) {
  query.filter(json, params, callback)
}

module.exports = {
  fields: fields,
  process: processTemplate,
  setGeomType: setGeomType,
  info: info,
  isTable: isTable,
  layers: layers,
  query: queryData,
  queryIds: queryIds,
  send: send,

  // duplicated in query
  fieldTypes: fieldTypes,
  fieldType: fieldType,
  isInt: isInt
}
