var terraformer = require('terraformer')
var sql = require('sql-parser')
var _ = require('lodash')

/** @type {object} maps common type names to esri type names */
var fieldTypes = {
  'string': 'esriFieldTypeString',
  'integer': 'esriFieldTypeInteger',
  'date': 'esriFieldTypeDate',
  'datetime': 'esriFieldTypeDate',
  'float': 'esriFieldTypeDouble'
}

/** @type {object} maps common type names to esri type names */
var geometryTypes = {
  esriGeometryPoint: function (geom) {
    var coords = geom.split(',')
    return new terraformer.Point([coords[0], coords[1]])
  },
  esriGeometryEnvelope: function (geom) {
    if (typeof (geom) === 'object') {
      var box = new terraformer.Polygon([[
        [geom.xmin, geom.ymin],
        [geom.xmin, geom.ymax],
        [geom.xmax, geom.ymax],
        [geom.xmax, geom.ymin],
        [geom.xmin, geom.ymin]
      ]])

      if (geom.spatialReference && geom.spatialReference.wkid === '102100') {
        return box.toGeographic()
      } else {
        return box
      }
    } else {
      geom = geom.split(',').map(function (v) { return parseFloat(v) })
      return new terraformer.Polygon([[
        [geom[0], geom[1]],
        [geom[0], geom[3]],
        [geom[2], geom[3]],
        [geom[2], geom[1]],
        [geom[0], geom[1]]
      ]])
    }
  },
  esriGeometryMultipoint: function () { throw new Error('not supported yet') },
  esriGeometryPolyline: function () { throw new Error('not supported yet') },
  esriGeometryPolygon: function () { throw new Error('not supported yet') }
}

/**
 * TODO: missing description
 *
 * supported:
 *
 * esriSpatialRelContains
 * esriSpatialRelWithin
 *
 * NEED to support these:
 *
 * esriSpatialRelIntersects
 * esriSpatialRelCrosses
 * esriSpatialRelEnvelopeIntersects
 * esriSpatialRelIndexIntersects
 * esriSpatialRelOverlaps
 * esriSpatialRelTouches
 * esriSpatialRelRelation
 */
var spatialFilter = {
  esriSpatialRelContains: function (features, geometry) {
    return _.filter(features, function (f) {
      var featureGeom
      if (f.geometry.x && f.geometry.y) {
        featureGeom = new terraformer.Point([f.geometry.x, f.geometry.y])
      } else if (f.geometry.rings) {
        featureGeom = new terraformer.Polygon(f.geometry.rings)
      } else if (f.geometry.paths) {
        featureGeom = new terraformer.LineString(f.geometry.paths)
      }

      if (featureGeom) {
        return featureGeom.within(geometry)
      }
    })
  },
  esriSpatialRelWithin: function (features, geometry) {
    return _.filter(features, function (f) {
      var featureGeom
      if (f.geometry.x && f.geometry.y) {
        featureGeom = new terraformer.Point([f.geometry.x, f.geometry.y])
      } else if (f.geometry.rings) {
        featureGeom = new terraformer.Polygon([f.geometry.rings])
      } else if (f.geometry.paths) {
        featureGeom = new terraformer.LineString(f.geometry.paths)
      }
      if (featureGeom) {
        return featureGeom.within(geometry)
      }
    })
  }
}

/** @type {object} comparison operators for where queries */
var whereOps = {
  '<': function (param, val) { return (param < val) },
  '=': function (param, val) { return (param === val) },
  '==': function (param, val) { return (param === val) },
  '<=': function (param, val) { return (param <= val) },
  '>': function (param, val) { return (param > val) },
  '>=': function (param, val) { return (param >= val) }
}

/**
 * process all query params filters
 *
 * @param {object} json
 * @param {object} params
 * @param {Function} callback
 */
function filter (json, params, callback) {
  if (params.geometry) {
    geometryFilter(json, params, callback)
  } else if (params.where) {
    whereFilter(json, params, callback)
  } else {
    // probably better to parse all params upfront and confirm valid types
    if (params.returnCountOnly === 'true' || params.returnCountOnly) {
      callback(null, { count: json.features.length })
    } else if (params.returnIdsOnly === 'true' || params.returnIdsOnly) {
      getIds(json, params.idField, params, callback)
    } else {
      if (params.orderByFields && params.orderByFields !== '') {
        var fld = params.orderByFields.split(' ')
        var order = fld[0]
        if (fld[fld.length - 1] === 'DESC') order = '-' + fld[0]
        json.features = orderBy(json.features, params.orderByFields, order)
      }

      if (params.returnGeometry === false || params.returnGeometry === 'false') {
        json.features.forEach(function (f) {
          delete f.geometry
        })
      } else if (params.outSR && ((params.outSR === '102100') || (params.outSR.indexOf('102100') > -1))) {
        if (json.spatialReference) {
          json.spatialReference.wkid = '102100'
          var coords
          // project each geometry to merator
          json.features.forEach(function (f) {
            if (f.geometry) {
              if (f.geometry.x && f.geometry.y) {
                coords = new terraformer.Point([f.geometry.x, f.geometry.y]).toMercator().coordinates
                f.geometry.x = coords[0]
                f.geometry.y = coords[1]
              } else if (f.geometry.rings) {
                f.geometry.rings = new terraformer.Polygon(f.geometry.rings).toMercator().coordinates
              } else if (f.geometry.paths) {
                f.geometry.paths = new terraformer.LineString(f.geometry.paths).toMercator().coordinates
              }
              f.geometry.spatialReference.wkid = '102100'
            }
          })
        }
      }

      // checkout for outfields
      if (params.outFields && params.outFields !== '*') {
        var features = []
        var outFields = params.outFields.split(',')

        json.features.forEach(function (f) {
          var props = _.pick(f.attributes || f.properties, outFields)
          var newFeature = { geometry: f.geometry }

          if (f.properties) {
            newFeature.properties = props
          } else {
            newFeature.attributes = props
          }

          features.push(newFeature)
        })

        json.features = features
      }

      // before we send back json, process outStats
      if (params.outStatistics) {
        outStatistics(json, params, callback)
      } else {
        // providers can pass in an "overrides" param
        if (params.overrides) {
          for (var prop in params.overrides) {
            json[prop] = params.overrides[prop]
          }
        }
        callback(null, json)
      }
    }
  }
}

/**
 * TODO: missing description
 *
 * @param {string} type
 * @param {string} field
 * @param {object} features
 * @return {*} min | max | count | sum | avg | stddev | var
 */
function calculateStat (type, field, features) {
  var propName = (features[0].attributes) ? 'attributes' : 'properties'
  var types = {
    'min': function (field, features) {
      var min = features[0][propName][field]
      features.forEach(function (f) {
        if (f[propName][field] < min) {
          min = f[propName][field]
        }
      })
      return min
    },
    'max': function (field, features) {
      var max = features[0][propName][field]
      features.forEach(function (f) {
        if (f[propName][field] > max) {
          max = f[propName][field]
        }
      })
      return max
    },
    'count': function (field, features) {
      var count = 0
      features.forEach(function (f) {
        if (f[propName][field]) {
          count++
        }
      })
      return count
    },
    'sum': function (field, features) {
      var sum = 0
      features.forEach(function (f) {
        if (f[propName][field]) {
          sum += parseFloat(f[propName][field])
        }
      })
      return sum
    },
    'avg': function (field, features) {
      var sum = types.sum(field, features)
      return sum / features.length
    },
    'stddev': function (field, features) {
      var v = types.var(field, features)
      return Math.sqrt(v)
    },
    'var': function (field, features) {
      var avg = types.avg(field, features)
      var i = features.length
      var v = 0

      while (i--) {
        v += Math.pow((features[i][propName][field] - avg), 2)
      }

      v /= features.length

      return v
    }
  }

  return types[type.toLowerCase()](field, features)
}

/**
 * TODO: missing description
 *
 * @param {object} json
 * @param {object} params
 * @param {function} callback
 */
function outStatistics (json, params, callback) {
  try {
    json.fields = []
    // replacing slashes in cases where escaped slashes given
    var stats = JSON.parse(params.outStatistics.replace(/\\|'/g, ''))
    if (stats.length) {
      if (params.groupByFieldsForStatistics) {
        buildUniqueFeatures(params, json.features, function (err, uniques) {
          if (err) {
            return callback('unable to build unique features with property ' + params.groupByFieldsForStatistics, null)
          }
          var finalJson = {fields: null, features: []}

          for (var value in uniques) {
            var statResult = buildStats(stats, { features: uniques[value] }, params)
            // always has one feature, must add the value of grouped attr
            statResult.features[0].attributes[params.groupByFieldsForStatistics] = value
            finalJson.fields = statResult.fields
            finalJson.features.push(statResult.features[0])
          }

          // create a field entry for the grouped attribute
          finalJson.fields.push({
            name: params.groupByFieldsForStatistics,
            type: fieldType(finalJson.features[1].attributes[params.groupByFieldsForStatistics]),
            alias: params.groupByFieldsForStatistics
          })

          return callback(null, finalJson)
        })
      } else {
        json = buildStats(stats, json, params)
        return callback(null, json)
      }
    } else {
      return callback("'outStatistics' parameter is invalid", null)
    }
  } catch (e) {
    console.error(e)
    return callback("'outStatistics' parameter is invalid", null)
  }
}

/**
 * TODO: missing description
 *
 * @param {object} json
 * @param {object} params
 * @param {function} callback
 */
function buildUniqueFeatures (params, features, callback) {
  var propName = (features[0].attributes) ? 'attributes' : 'properties'
  var uniqs = {}

  try {
    features.forEach(function (feature) {
      var prop = feature[propName][params.groupByFieldsForStatistics]
      if (prop) {
        if (!uniqs[prop]) {
          uniqs[prop] = [feature]
        } else {
          uniqs[prop].push(feature)
        }
      }
    })
    return callback(null, uniqs)
  } catch (e) {
    return callback(e, null)
  }
}

/**
 * TODO: missing description
 *
 * @param {array} stats
 * @param {object} json
 * @return {object} modified json
 */
function buildStats (stats, json) {
  var statFeatures = [{ attributes: {} }]

  if (!json.fields) {
    json.fields = []
  }

  stats.forEach(function (stat) {
    var value = calculateStat(stat.statisticType, stat.onStatisticField, json.features)
    statFeatures[0].attributes[stat.outStatisticFieldName] = value
    json.fields.push({
      name: stat.outStatisticFieldName,
      type: fieldType(value),
      alias: stat.outStatisticFieldName
    })
  })

  json.features = statFeatures

  return json
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
 * @param  {number} value
 * @return {boolean}
 */
function isInt (value) {
  return Math.round(value) === value
}

/**
 * parse esri geometry into geojson
 *
 * @param {string|object} geom - esri geometry object
 * @param {string} type - esri geometry type
 * @return {object} geojson
 */
function parseGeometry (geom, type) {
  try {
    geom = JSON.parse(geom)
    if (geom.xmin) {
      return geometryTypes[type](geom)
    } else {
      // what are you doing chelm
      return geometryTypes[type](geom)
    }
  } catch (e) {
    return geometryTypes[type](geom)
  }
}

/**
 * subset the features by geometry
 * TODO: support more than points
 *
 * @param {object} json
 * @param {object} params
 * @param {function} callback
 */
function geometryFilter (json, params, callback) {
  // Parse the geometry
  var type = params.geometryType || 'esriGeometryEnvelope'
  delete params.geometryType
  var geometry = parseGeometry(params.geometry, type)
  delete params.geometry

  var spatialRel = params.spatialRel || 'esriSpatialRelContains'
  if (spatialFilter[spatialRel]) {
    json.features = spatialFilter[spatialRel](json.features, geometry)
  }

  // recycle the params after we run the geom filter
  filter(json, params, callback)
}

/**
 * process the where filter in the params
 * TODO: actually support parsing where clauses
 *
 * @param {object} json
 * @param {object} params
 * @param {function} callback
 */
function whereFilter (json, params, callback) {
  var where = sql.parse('select * from foo where ' + params.where).where
  var features = []

  _.each(json.features, function (f) {
    var props = f.attributes || f.properties
    var param = where.conditions.left.value
    var val = where.conditions.right.value
    // TODO: unpack this mess
    var wtf = whereOps[where.conditions.operation] && props[param] && whereOps[where.conditions.operation](props[param], val)

    if (wtf || param === val) features.push(f)
  })

  json.features = features

  delete params.where
  // recycle the data + params through the filter fn
  filter(json, params, callback)
}

/**
 * TODO: missing description
 *
 * @param {object} features
 * @param {string} field
 * @param {string} order
 */
function orderBy (features, field, order) {
  function dynamicSort (property) {
    var sortOrder = 1

    if (property[0] === '-') {
      sortOrder = -1
      property = property.substr(1)
    }

    return function (a, b) {
      var isLess = a.attributes[property] < b.attributes[property]
      var isMore = a.attributes[property] > b.attributes[property]
      var result = isLess ? -1 : isMore ? 1 : 0
      return result * sortOrder
    }
  }

  features.sort(dynamicSort(order))

  return features
}

/**
 * returns only the ids of the features (when returnIdsOnly=true)
 *
 * @param {object} json
 * @param {string} field
 * @param {object} params
 * @param {function} callback
 */
function getIds (json, field, params, callback) {
  field = field ? field : json.objectIdFieldName || 'id'

  var objectIds = []
  var props

  if (params.orderByFields && params.orderByFields !== '') {
    var fld = params.orderByFields.split(' ')
    var order = fld[0]

    if (fld[fld.length - 1] === 'DESC') {
      order = '-' + fld[0]
    }

    json.features = orderBy(json.features, params.orderByFields, order)
  }

  json.features.forEach(function (f) {
    props = f.attributes || f.properties
    objectIds.push(props[field])
  })

  callback(null, {
    objectIdField: field,
    objectIds: objectIds
  })
}

module.exports = {
  geometryTypes: geometryTypes,
  spatialFilter: spatialFilter,
  whereOps: whereOps,
  filter: filter,
  calculateStat: calculateStat,
  outStatistics: outStatistics,
  buildUniqueFeatures: buildUniqueFeatures,
  buildStats: buildStats,
  parseGeometry: parseGeometry,
  geometryFilter: geometryFilter,
  whereFilter: whereFilter,
  orderBy: orderBy,
  getIds: getIds,

  // duplicated in FeatureServices
  fieldTypes: fieldTypes,
  fieldType: fieldType,
  isInt: isInt
}
