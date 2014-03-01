module.exports = {
  'get /climate': {
    controller: 'climate',
    action: 'list'
  },

  'get /climate/:type': {
    controller: 'climate',
    action: 'find'
  },

  'get /climate/:type/FeatureServer/:layer/:method': {
    controller: 'climate',
    action: 'featureserver'
  },

  'get /climate/:type/FeatureServer/:layer': {
    controller: 'climate',
    action: 'featureserver'
  },

  'get /climate/:type/FeatureServer': {
    controller: 'climate',
    action: 'featureserver'
  },

  'get /climate/:type/tiles/:z/:x/:y.:format': {
    controller : 'climate',
    action: 'tiles'
  }

}
