const { within, contains, intersects, envelopeIntersects, hashedObjectIdComparator } = require('./filters');
const sql = require('alasql');
const {
  project,
  selectFields,
  selectFieldsToEsriAttributes,
  toGeohash,
  toEsriAttributes,
  toHash,
  toEsriGeometry,
  reducePrecision
} = require('./transforms');

sql.MAXSQLCACHESIZE = 0;

sql.fn.ST_Within = within;

sql.fn.ST_Contains = contains;

sql.fn.ST_Intersects = intersects;

sql.fn.ST_EnvelopeIntersects = envelopeIntersects;

sql.fn.hashedObjectIdComparator = hashedObjectIdComparator;

sql.fn.project = project;

sql.fn.geohash = toGeohash;

sql.fn.toEsriAttributes = toEsriAttributes;

sql.fn.selectFields = selectFields;

sql.fn.selectFieldsToEsriAttributes = selectFieldsToEsriAttributes;

sql.aggr.hash = toHash;

sql.fn.esriGeometry = toEsriGeometry;

sql.fn.reducePrecision = reducePrecision;

module.exports = sql;
