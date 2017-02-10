module.exports = function (projection) {
  if (projection) return 'SELECT properties as attributes, esriGeom(project(geometry, ?)) as geometry FROM ?'
  else return 'SELECT properties as attributes, esriGeom(geometry) as geometry FROM ?'
}
