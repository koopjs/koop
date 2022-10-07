const filterAndTransform = require('./filter-and-transform');

module.exports = function (statement) {
  const query = filterAndTransform.compile(statement);
  return function (params) {
    const normalizedParams = normalizeParams(params);
    return query(normalizedParams);
  };
};

function normalizeParams (inParams) {
  let params;
  // If this is just a passed in feature
  if (!inParams.length) params = [[inParams]];
  // If this is an array of features
  if (isGeoJSONFeatures(inParams) || isEsriFeatures(inParams)) params = [inParams];
  return params;
}

function isGeoJSONFeatures (candidate) {
  const feature = candidate[0] || {};
  if (feature.type && feature.type.toLowerCase() === 'feature') return true;
  else return false;
}

function isEsriFeatures (candidate) {
  const feature = candidate[0] || {};
  if (feature.attributes || feature.geometry) return true;
  else return false;
}
