const Terraformer = require('terraformer')

function createClause (options) {
  if (!options.geometry) return
  const spatialPredicate = options.spatialPredicate || 'ST_Intersects'
  return `${spatialPredicate}(geometry, ?)`
}

module.exports = { createClause }
