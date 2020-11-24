const _ = require('lodash')

function packageFeatures (features = [], { groupBy, aggregates, collection } = {}) {
  if (groupBy || (!aggregates && !collection)) {
    return features
  }

  if (aggregates) {
    return features[0]
  }

  if (collection) {
    return _.chain(collection).cloneDeep().set('features', features).value()
  }
}
module.exports = packageFeatures
