var arcgisToGeoJSON = require('arcgis-to-geojson-utils').arcgisToGeoJSON
var _ = require('lodash')
var toGeoJSON = {}

/**
 * Converts csv to geojson
 *
 * @param {array} csv - CSV file parsed using https://www.npmjs.com/package/csv
 * @param {function} callback - called on completion with geojson
 */
toGeoJSON.fromCSV = function (csv, callback) {
  var geojson = { type: 'FeatureCollection', features: [] }
  var lat = null
  var lon = null
  var feature, headers

  csv.forEach(function (row, i) {
    if (i === 0) {
      headers = row

      // search a whitelist of lat longs to try to build a geom
      headers.forEach(function (h, i) {
        switch (h.trim().toLowerCase()) {
          case 'lat':
          case 'latitude':
          case 'latitude_deg':
          case 'y':
            lat = i
            break
          case 'lon':
          case 'longitude':
          case 'longitude_deg':
          case 'long':
          case 'x':
            lon = i + ''
            break
        }
      })
    } else {
      feature = { type: 'Feature', id: i, properties: {}, geometry: null }

      row.forEach(function (col, j) {
        var colNum = col.replace(/,/g, '')
        feature.properties[headers[j]] = (!isNaN(colNum)) ? parseFloat(colNum) : col
      })

      // add an object to CSV data
      feature.properties.OBJECTID = i

      if (lat && lon) {
        feature.geometry = {
          type: 'Point',
          coordinates: [parseFloat(row[parseInt(lon, 10)]), parseFloat(row[parseInt(lat, 10)])]
        }
      }

      geojson.features.push(feature)
    }
  })

  callback(null, geojson)
}

/**
 * Converts esri json to geojson
 *
 * @param {object} inFields - The fields object returned in esri json
 * @param {object} json - The entire esri json response
 * @param {function} callback - Calls back with an error or converted geojson
 */
toGeoJSON.fromEsri = function (inFields, json, callback) {
  // TODO in a breaking change remove the infields parameter
  if (!inFields || !inFields.length) inFields = json.fields
  var geojson = {type: 'FeatureCollection'}
  var fields = convertFields(inFields)

  geojson.features = _.map(json.features, function (feature, index) {
    return transformFeature(feature, fields, index)
  })

  callback(null, geojson)
}

/**
 * Converts a single feature from esri json to geojson
 *
 * @param {object} feature - a single esri feature
 * @param {object} fields - the fields object from the service
 * @returns {object} feature - a geojson feature
 * @private
 */
function transformFeature (feature, fields) {
  var attributes = {}
  // first transform each of the features to the converted field name and transformed value
  if (feature.attributes && Object.keys(feature.attributes)) {
    _.each(Object.keys(feature.attributes), function (name) {
      // convert attribute expects an actual object and not just the values
      var attr = {}
      attr[name] = feature.attributes[name]
      try {
        attributes[fields[name].outName] = convertAttribute(attr, fields[name])
      } catch (e) {
        console.error('Field was missing from attribute')
      }
    })
  }
  return {
    type: 'Feature',
    properties: attributes,
    geometry: parseGeometry(feature.geometry)
  }
}

/**
 * Convert an esri geometry to a geojson geometry
 *
 * @param {object} geometry - an esri geometry object
 * @return {object} geojson geometry
 * @private
 */
function parseGeometry (geometry) {
  try {
    const parsed = geometry ? arcgisToGeoJSON(geometry) : null
    if (parsed && parsed.type && parsed.coordinates) return parsed
    else return null
    return parsed
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * Converts a set of fields to have names that work well in javascript
 *
 * @params {object} inFields - the orginal fields object from the esri json
 * @retruns {object} fields - converted fields
 * @private
 */
function convertFields (inFields) {
  var fields = {}
  _.each(inFields, function (field) {
    field.outName = convertFieldName(field.name)
    fields[field.name] = field
  })
  return fields
}

/**
 * Converts a single field name to a legal javascript object key
 *
 * @params {string} name - the original field name
 * @returns {string} outName - a cleansed field name
 * @private
 */
function convertFieldName (name) {
  var regex = new RegExp(/\.|\(|\)/g)
  return name.replace(regex, '')
}

/**
 * Decodes an attributes CVD and standarizes any date fields
 *
 * @params {object} attribute - a single esri feature attribute
 * @params {object} field - the field metadata describing that attribute
 * @returns {object} outAttribute - the converted attribute
 * @private
 */
function convertAttribute (attribute, field) {
  var inValue = attribute[field.name]
  var value
  if (inValue === null) return inValue
  if (field.domain && field.domain.type === 'codedValue') {
    value = cvd(inValue, field)
  } else if (field.type === 'esriFieldTypeDate') {
    try {
      value = new Date(inValue).toISOString()
    } catch (e) {
      value = inValue
    }
  } else {
    value = inValue
  }
  return value
}

/**
 * Looks up a value from a coded domain
 *
 * @params {integer} - The original field value
 * @params {object} field - metadata describing the attribute field
 * @returns {string/integer/float} - The decoded field value
 * @private
 */
function cvd (value, field) {
  var domain = _.find(field.domain.codedValues, d => {
    return value === d.code
  })
  return domain ? domain.name : value
}

module.exports = toGeoJSON
