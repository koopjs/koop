module.exports = { getGeom }

function getGeom (data, params) {
  if (!data.features) throw new Error('No features found in input data')
  if (!data.features[0].geometry) throw new Error('Features do not have geometry')

  const geomType = getDataGeom(data)
  checkBaseSymbolGeom(params, geomType)
  checkLayerGeom(data, geomType)
  return geomType
}

function getDataGeom (data) {
  const type = data.features[0].geometry.type
  data.features.forEach(feature => {
    if (feature.geometry.type !== type) {
      throw new Error('Geometry types are not consistent')
    }
  })
  if (type !== 'Point' && type !== 'Line' && type !== 'Polygon') {
    throw new Error('Unrecognized geometry type: ' + type)
  }
  return type
}

function checkBaseSymbolGeom (params, geomType) {
  if (params.classificationDef && params.classificationDef.baseSymbol) {
    const baseSymbol = params.classificationDef.baseSymbol
    if (!baseSymbol.type) throw new Error('baseSymbol requires a type')
    // if geometries are incompatible
    if (
      (geomType === 'Point' && baseSymbol.type !== 'esriSMS') ||
      (geomType === 'Line' && baseSymbol.type !== 'esriSLS') ||
      (geomType === 'Polygon' && baseSymbol.type !== 'esriSFS')
    ) throw new Error('Cannot use a base symbol type that differs from data geometry')
  }
}

// TODO: determine if this is a correct & valuable check
function checkLayerGeom (data, geomType) {
  if (data.metadata && data.metadata.geometry) {
    if (data.metadata.geometry !== `esriGeometry${geomType}`) {
      throw new Error('Layer geomeryType is not the same as input data gemoetry')
    }
  }
}
