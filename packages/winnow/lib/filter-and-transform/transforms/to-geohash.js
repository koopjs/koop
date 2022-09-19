const { encode } = require('ngeohash');
const { default: centroid } = require('@turf/centroid');

function transformToGeohash (geometry = {}, precision = 8) {
  const { type, coordinates } = geometry;
  if (!type || !coordinates) return;

  let centroidGeometry;

  if (type !== 'Point') {
    centroidGeometry = centroid(geometry);
  }
  const { coordinates: geohashTarget } = centroidGeometry || geometry;
  return encode(geohashTarget[1], geohashTarget[0], precision);
}

module.exports = transformToGeohash;
