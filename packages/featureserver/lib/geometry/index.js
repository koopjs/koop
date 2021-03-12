const normalizeSpatialReference = require('../helpers/normalize-spatial-reference')
const computeExtent = require('./extents')
const geometryMap = require('./geometry-map')

module.exports = { computeExtent, geometryMap, normalizeSpatialReference }
