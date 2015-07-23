var terraformerParser = require('terraformer-arcgis-parser')
var toGeoJSON = {}

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

toGeoJSON.fromEsri = function (fields, json, callback) {
  var dateFields = []

  fields.forEach(function (f) {
    if (f.type === 'esriFieldTypeDate') {
      dateFields.push(f.name)
    }
  })

  // use terraformer to convert esri json to geojson
  var geojson = {type: 'FeatureCollection', features: []}
  var feature, newFeature

  json.features.forEach(function (f, i) {
    try {
      // if we have attributes we need to remove special chars for shp limitations
      if (f.attributes) {
        var regex = new RegExp(/\.|\(|\)/g)
        var attr, attrNew, match

        for (attr in f.attributes) {
          // if we have a special char in the field name remove it
          match = attr.match(regex)

          if (match && match.length) {
            attrNew = attr.replace(regex, '')
            f.attributes[attrNew] = f.attributes[attr]
            delete f.attributes[attr]
          }

          fields.forEach(function (field) {
            if (field.name === attr && field.domain && field.domain.codedValues) {
              field.domain.codedValues.forEach(function (c) {
                if (f.attributes[attr] === c.code) f.attributes[attr] = c.name
              })
            }
          })
        }
      }

      if (f.geometry) {
        feature = terraformerParser.parse(f)

        // build a new feature
        // 'feature' has bboxes we dont want and 'delete' is slow
        newFeature = {
          type: 'Feature',
          id: feature.id,
          properties: feature.properties,
          geometry: {
            type: feature.geometry.type,
            coordinates: feature.geometry.coordinates
          }
        }

        if (!newFeature.id) {
          newFeature.id = i + 1
        }
      } else {
        newFeature = {
          id: i + 1,
          properties: f.attributes,
          type: 'Feature',
          geometry: null
        }
      }

      if (dateFields.length) {
        dateFields.forEach(function (d) {
          if (newFeature.properties[d]) {
            newFeature.properties[d] = new Date(newFeature.properties[d]).toISOString()
          }
        })
      }

      geojson.features.push(newFeature)
    } catch (e) {
      if (dateFields.length) {
        dateFields.forEach(function (d) {
          if (f.attributes[d]) {
            f.attributes[d] = new Date(f.attributes[d]).toISOString()
          }
        })
      }

      newFeature = {
        type: 'Feature',
        id: i + 1,
        properties: f.attributes,
        geometry: null
      }

      geojson.features.push(newFeature)
    }
  })

  callback(null, geojson)
}

module.exports = toGeoJSON
