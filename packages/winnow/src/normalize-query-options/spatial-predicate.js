const esriPredicates = {
  esriSpatialRelContains: 'ST_Contains',
  esriSpatialRelWithin: 'ST_Within',
  esriSpatialRelIntersects: 'ST_Intersects',
  esriSpatialRelEnvelopeIntersects: 'ST_EnvelopeIntersects'
};

function normalizeSpatialPredicate ({ spatialPredicate, spatialRel } = {}) {
  const predicate = spatialPredicate || spatialRel;
  return esriPredicates[predicate] || predicate;
}

module.exports = normalizeSpatialPredicate;
