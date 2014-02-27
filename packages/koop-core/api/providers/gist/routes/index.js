module.exports = {
  'get /gist/:id/FeatureServer/:layer/:method': {
    controller: 'gist',
    action: 'featureservice'
  },

  'get /gist/:id/FeatureServer/:layer': {
    controller: 'gist',
    action: 'featureservice'
  },
  
  'get /gist/:id/FeatureServer': {
    controller: 'gist',
    action: 'featureservice'
  },

  'get /gist/:id.:format': {
    controller: 'gist',
    action: 'find'
  },

  'get /gist/:id': {
    controller: 'gist',
    action: 'find'
  },

  'get /gist/raw/:id': {
    controller: 'gist',
    action: 'find'
  },

  'get /gist/raw/:id/:layer': {
    controller: 'gist',
    action: 'find'
  },

  'get /gist': {
    controller: 'gist',
    action: 'index'
  },
  
  'get /gist/:id/preview' : {
    controller: 'gist',
    action: 'preview'
  }
}
