const _ = require('lodash');
const OGC_WGS84 = 'ogc:1.3:crs84';

function getCollectionCrs (collection) {
  const collectionCrs = _.get(collection, 'crs.properties.name');
  if (!collectionCrs) return;

  const crs = collectionCrs.toLowerCase().replace('urn:ogc:def:crs:', '');
  if (crs === OGC_WGS84) {
    return '4326';
  }

  const crsRegex = /(?<authority>epsg|esri|sr-org|iau2000)(::|:)(?<srid>.+)/;
  const result = crsRegex.exec(crs);
  if (!result) {
    return;
  }
  const { groups: { srid } } = result;
  return srid;
}

module.exports = getCollectionCrs;
