'use strict'
const sql = require('./sql')
const Query = require('./query')

function winnow (features, where, inGeom, options) {
  let featureCollection
  if (features.type === 'FeatureCollection') {
    featureCollection = true
    features = features.features
  }
  const geometry = Query.setGeometry(inGeom)
  const query = Query.create(where, geometry, options)
  const params = Query.params(features, geometry)
  const filtered = sql(query, params)
  return finish(filtered, featureCollection)
}

function finish (features, featureCollection) {
  if (featureCollection) {
    return {
      type: 'FeatureCollection',
      features
    }
  } else {
    return features
  }
}

module.exports = winnow
