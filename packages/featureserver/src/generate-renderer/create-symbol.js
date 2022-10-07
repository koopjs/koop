const {
  PointRenderer,
  LineRenderer,
  PolygonRenderer
} = require('../helpers');
const { CodedError } = require('../helpers/errors');

module.exports = { createSymbol };

function createSymbol (baseSymbol, color, geomType) {
  const symbol = baseSymbol || getDefaultSymbol(geomType);
  return { ...symbol, color };
}

function getDefaultSymbol (geomType) {
  const { symbol } = getSymbolRenderer(geomType);
  return symbol;
}

function getSymbolRenderer (geomType) {
  if (geomType === 'esriGeometryPoint' || geomType === 'esriGeometryMultiPoint') {
    return new PointRenderer();
  }

  if (geomType === 'esriGeometryPolyline') {
    return new LineRenderer();
  }

  if (geomType === 'esriGeometryPolygon') {
    return new PolygonRenderer();
  }

  throw new CodedError('Dataset geometry type is not supported for renderers.', 400);
}
