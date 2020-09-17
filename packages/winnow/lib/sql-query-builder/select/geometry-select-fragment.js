function createGeometrySelectFragment (options = {}) {
  const geometryFunctions = []
  if (options.projection) geometryFunctions.push('project($,?)')
  if (options.geometryPrecision) geometryFunctions.push('reducePrecision($,?)')
  if (options.toEsri) geometryFunctions.push('esriGeom($)')

  if (geometryFunctions.length === 0) return 'geometry'

  const inlineGeometryFunctions = geometryFunctions.reduce(nestGeometryFunctions, '')
  return `${inlineGeometryFunctions} as geometry`
}

function nestGeometryFunctions (nestedFunctionString, functionString, index) {
  if (index === 0) {
    return functionString.replace('$', 'geometry')
  }
  return functionString.replace('$', nestedFunctionString)
}

module.exports = createGeometrySelectFragment
