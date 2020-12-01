const _ = require('lodash')
const normalizeSpatialReference = require('../helpers/normalize-spatial-reference')

function packageFeatures (features = [], { groupBy, aggregates, collection, projection } = {}) {
  if (groupBy || (!aggregates && !collection)) {
    return features
  }

  if (aggregates) {
    return features[0]
  }

  if (collection) {
    return packageCollection({ features, collection, projection })
  }
}

function packageCollection ({ features, collection, projection }) {
  const outputCollection = _.chain(collection).cloneDeep().set('features', features)
  if (!projection) {
    return outputCollection.value()
  }

  const { wkid } = normalizeSpatialReference(projection)
  const crs = `urn:ogc:def:crs:EPSG::${wkid}`
  return outputCollection.set('crs.properties.name', crs).value()
}

module.exports = packageFeatures
