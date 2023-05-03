const isDifferentCrs = require('../is-different-crs');
function createGeometrySelectFragment ({ inputCrs, outputCrs, geometryPrecision, toEsri } = {}) {
  const geometryFunctions = [];
  if (isDifferentCrs(inputCrs, outputCrs)) {
    geometryFunctions.push('project(~~,?,?)');
  }

  if (geometryPrecision) {
    geometryFunctions.push('reducePrecision(~~,?)');
  }

  if (toEsri) {
    geometryFunctions.push('esriGeometry(~~)');
  }

  if (geometryFunctions.length === 0) {
    return 'geometry';
  }

  const inlineGeometryFunctions = geometryFunctions.reduce(nestGeometryFunctions, '');
  return `${inlineGeometryFunctions} as geometry`;
}

function nestGeometryFunctions (nestedFunctionString, functionString, index) {
  if (index === 0) {
    return functionString.replace('~~', 'geometry');
  }
  return functionString.replace('~~', nestedFunctionString);
}

module.exports = createGeometrySelectFragment;
