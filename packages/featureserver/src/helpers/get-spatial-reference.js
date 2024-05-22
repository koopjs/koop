const getCollectionCrs = require('./get-collection-crs');
const normalizeSpatialReference = require('./normalize-spatial-reference');

function getSpatialReference(geojson, { inputCrs, sourceSR } = {}) {
  const spatialReference = inputCrs ||
    sourceSR ||
    getCollectionCrs(geojson) || { wkid: 4326, latestWkid: 4326 };

  const { latestWkid, wkid, wkt } = normalizeSpatialReference(spatialReference);

  if (wkid) {
    return { wkid, latestWkid };
  }

  return { wkt };
}

module.exports = getSpatialReference;
