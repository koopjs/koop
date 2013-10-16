module.exports = {
  
  'get /github/': {
    controller: 'github',
    action: 'index'
  },

  'get /github/:user': {
    controller: 'github',
    action: 'notFound'
  },

  'get /github/:user/:repo': {
    controller: 'github',
    action: 'getRepo'
  },

  'get /github/:user/:repo/FeatureServer': {
    controller: 'github',
    action: 'featureservice'
  },

  'get /github/:user/:repo/FeatureServer/:layer': {
    controller: 'github',
    action: 'featureservice'
  },

  'get /github/:user/:repo/FeatureServer/:layer/:method': {
    controller: 'github',
    action: 'featureservice'
  },

  'get /github/:user/:repo/:file': {
    controller: 'github',
    action: 'getRepo'
  },

  'get /github/:user/:repo/:file/FeatureServer': {
    controller: 'github',
    action: 'featureservice'
  },

  'get /github/:user/:repo/:file/FeatureServer/:layer': {
    controller: 'github',
    action: 'featureservice'
  },

  'get /github/:user/:repo/:file/FeatureServer/:layer/:method': {
    controller: 'github',
    action: 'featureservice'
  },

  'get /github/:user/:repo/:file/preview' : {
    controller  : 'github',
    action: 'preview'
  },

  'get /github/:user/:repo/:file/tiles/preview' : {
    controller  : 'github',
    action: 'tile_preview'
  },

  'get /github/:user/:repo/:file/tiles/:z/:x/:y.:format': { //:z/:x/:y' : {
    controller : 'github',
    action: 'tiles'
  },

  'get /github/:user/:repo/:file/:layer/tiles/:z/:x/:y.:format': { //:z/:x/:y' : {
    controller : 'github',
    action: 'tiles'
  }

}
