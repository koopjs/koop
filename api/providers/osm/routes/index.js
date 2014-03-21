module.exports = {
  
  'get /osm': {
    controller: 'osm',
    action: 'listTypes'
  },

  'get /osm/:type': {
    controller: 'osm',
    action: 'getData'
  },

  'get /osm/:type/FeatureServer/:layer/:method': {
    controller: 'osm',
    action: 'featureserver'
  },

  'get /osm/:type/FeatureServer/:layer': {
    controller: 'osm',
    action: 'featureserver'
  },
  
  'get /osm/:type/FeatureServer': {
    controller: 'osm',
    action: 'featureserver'
  }
}
