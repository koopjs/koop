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
  },

  'get /osm/:type/explore': {
    controller: 'osm',
    action: 'explore'
  },

  'get /osm/:type/:boundaryType/count': {
    controller: 'osm',
    action: 'getCounts'
  },

  'get /osm/:type/distinct/:field': {
    controller: 'osm',
    action: 'getDistinct'
  }
}
