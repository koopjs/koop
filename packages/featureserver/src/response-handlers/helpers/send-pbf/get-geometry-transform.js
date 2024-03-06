const esriProjCodes = require('@esri/proj-codes');
const wktParser = require('wkt-parser');

function getGeometryTransform(spatialReference, quantizationParameters) {
  if (quantizationParameters) {
    return parseQuantizationParameters(quantizationParameters);
  }

  let scale = getSpatialReferenceScaleFactor(spatialReference);

  return {
    scale: {xScale: scale, yScale: scale},
    translate: { xTranslate: 0, yTranslate: 0 } // [-20037700, -30241100],
  };
}

function getSpatialReferenceScaleFactor({ wkt, wkid }) {
  wkt = wkt || esriProjCodes.lookup(wkid)?.wkt;

  if (!wkt) {
    return 1;
  }

  const wktInfo = wktParser(wkt);

  if (wktInfo?.UNIT?.name === 'degree') {
    return 1e-9;
  }
  
  if (wktInfo?.UNIT?.convert) {
    return 1 / wktInfo.UNIT.convert / 10000;
  }

  return 1;
}

function parseQuantizationParameters(q) {
  const {
    tolerance = null
  } = q;
  const scale = tolerance !== null  ? q.tolerance: 1;

  const [ xTranslate, yTranslate ] = q.extent != null ? [q.extent.xmin, q.extent.ymax] : [0, 0];
  
  return {
    originPosition: normalizeOriginPosition(q.originPosition),
    scale: { xScale: scale, yScale: scale },
    translate: { xTranslate, yTranslate }
  };
}

function normalizeOriginPosition(originPosition) {
  if (originPosition === 'upper-left') {
    return 'upperLeft';
  }

  if (originPosition === 'lower-left') {
    return 'lowerLeft';
  }

  return originPosition;
}

module.exports = {
  getGeometryTransform
};
