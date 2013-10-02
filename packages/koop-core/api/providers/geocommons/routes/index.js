module.exports = {
  'get /geocommons/:id/FeatureServer/:layer/:method': {
    controller: 'geocommons',
    action: 'featureservice'
  },

  'get /geocommons/:id/FeatureServer/:layer': {
    controller: 'geocommons',
    action: 'featureservice'
  },
  
  'get /geocommons/:id/FeatureServer': {
    controller: 'geocommons',
    action: 'featureservice'
  },

  'get /geocommons/:id': {
    controller: 'geocommons',
    action: 'find'
  },

  'get /geocommons': {
    controller: 'geocommons',
    action: 'index'
  },
  
  'get /geocommons/:id/preview' : {
    controller: 'geocommons',
    action: 'preview'
  }
}
