module.exports = function ({ geometry, spatialPredicate = 'ST_Intersects' } = {}) {
  if (!geometry) return
  // The "?" in the string below is a SQL query parameter.  When it is execute, a supplied value is used in its place
  return `${spatialPredicate}(geometry, ?)`
}
