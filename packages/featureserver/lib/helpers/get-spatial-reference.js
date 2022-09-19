const _ = require('lodash');
const getCollectionCrs = require('./get-collection-crs');
const normalizeSpatialReference = require('./normalize-spatial-reference');

function getSpatialReference (geojson, { inputCrs, sourceSR } = {}) {
  if (!inputCrs && !sourceSR && _.isEmpty(geojson)) return;
  const spatialReference = inputCrs || sourceSR || getCollectionCrs(geojson) || { wkid: 4326, latestWkid: 4326 };

  if (!spatialReference) return;

  const { latestWkid, wkid, wkt } = normalizeSpatialReference(spatialReference);

  if (wkid) {
    return { wkid, latestWkid };
  }

  return { wkt };
}

module.exports = getSpatialReference;
