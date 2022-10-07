const chroma = require('chroma-js');
const { CodedError } = require('../helpers/errors');

module.exports = { createColorRamp };

function createColorRamp (params = {}) {
  const {
    classification,
    colorRamps,
    type = 'algorithmic',
    fromColor = [0, 255, 0],
    toColor = [0, 0, 255],
    algorithm = 'HSVAlgorithm'
  } = params;

  if (!classification || classification.length === 0) {
    throw new Error('Must supply classification');
  }

  if (type === 'algorithmic') {
    return createAlgorithmicRamp({
      fromColor,
      toColor,
      algorithm,
      classificationCount: classification.length
    });
  }

  if (type === 'multipart') {
    return createMultipartRamp({ colorRamps, classificationCount: classification.length });
  }

  throw new CodedError(`Invalid color ramp type: ${type}`, 400);
}

function createMultipartRamp (options) {
  const { colorRamps, classificationCount } = options;

  if (!colorRamps || !Array.isArray(colorRamps)) {
    throw new CodedError(
      'Multipart color-ramps need a valid color-ramp configuration array'
    );
  }

  return colorRamps.map((ramp) => {
    return createAlgorithmicRamp({
      ...ramp,
      classificationCount
    });
  });
}

function createAlgorithmicRamp (options) {
  const { fromColor, toColor, algorithm, classificationCount } = options;
  const colorRamp = chroma.scale([fromColor.slice(0, 3), toColor.slice(0, 3)]);

  if (algorithm === 'esriCIELabAlgorithm') {
    return colorRamp.mode('lab').colors(classificationCount, 'rgb');
  }

  if (algorithm === 'esriLabLChAlgorithm') {
    return colorRamp.mode('lch').colors(classificationCount, 'rgb');
  }

  return colorRamp.mode('hsl').colors(classificationCount, 'rgb');
}
