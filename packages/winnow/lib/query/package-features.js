const _ = require('lodash')

function packageFeatures (features = [], { groupBy, aggregates, collection, outputCrs } = {}) {
  if (groupBy || (!aggregates && !collection)) {
    return features
  }

  if (aggregates) {
    return features[0]
  }

  if (collection) {
    return packageCollection({ features, collection, outputCrs })
  }
}

function packageCollection ({ features, collection, outputCrs: { wkid, wkt } = {} }) {
  const outputCollection = _.chain(collection).cloneDeep().set('features', features)
  if (!wkid && !wkt) {
    return outputCollection.value()
  }

  const crs = wkid ? `urn:ogc:def:crs:EPSG::${wkid}` : wkt
  return outputCollection.set('crs.properties.name', crs).value()
}

module.exports = packageFeatures
