const createIntegerHash = require('../helpers/create-integer-hash')

/**
 * This function is used when the where option includes an OBJECTID, but the data
 * contains no such property.  In such cases, it is assumed that the client has been
 * leveraging winnow's "toEsriAttributes" feature that creates OBJECTID on the fly by
 * doing a numeric hash of a feature.  In order to filter by OBJECTID, we have recreate
 * the numeric hash on the fly and compare it to the passed in OBJECTID.
 *
 * @param {object} properties GeoJSON feature properties
 * @param {*} geometry GeoJSON feature properties
 * @param {*} objectId the objectId the feature is being compared to.  Presumed to have been created by feature hashing
 * @param {*} operator the predicate operator
 */
module.exports = function (properties, geometry, objectId, operator) {
  const hashedFeature = createIntegerHash(JSON.stringify({ properties, geometry }))
  if (operator === '=' && hashedFeature === objectId) return true
  if (operator === '!=' && hashedFeature !== objectId) return true
  if (operator === '>' && hashedFeature > objectId) return true
  if (operator === '<' && hashedFeature < objectId) return true
  if (operator === '>=' && hashedFeature >= objectId) return true
  if (operator === '<=' && hashedFeature <= objectId) return true
  return false
}
