module.exports = {
  'post /cloudant/register': {
    controller: 'cloudant',
    action: 'register'
  },

  'get /cloudant': {
    controller: 'cloudant',
    action: 'list'
  },

  'get /cloudant/:id': {
    controller: 'cloudant',
    action: 'find'
  },

  'get /cloudant/:id/:item/_design/:view/_geo/:index': {
    controller: 'cloudant',
    action: 'findResource'
  },

  'get /cloudant/:id/:item/_design/:view/_geo/:index/FeatureServer/:layer/:method': {
    controller: 'cloudant',
    action: 'featureserver'
  },

  'get /cloudant/:id/:item/_design/:view/_geo/:index/FeatureServer/:layer': {
    controller: 'cloudant',
    action: 'featureserver'
  },

  'get /cloudant/:id/:item/_design/:view/_geo/:index/FeatureServer': {
    controller: 'cloudant',
    action: 'featureserver'
  },

  'post /cloudant/:id/:item/_design/:view/_geo/:index/FeatureServer/:layer/:method': {
    controller: 'cloudant',
    action: 'featureserver'
  },

  'post /cloudant/:id/:item/_design/:view/_geo/:index/FeatureServer/:layer': {
    controller: 'cloudant',
    action: 'featureserver'
  },

  'post /cloudant/:id/:item/_design/:view/_geo/:index/FeatureServer': {
    controller: 'cloudant',
    action: 'featureserver'
  },

  'get /cloudant/:id/:item/_design/:view/_geo/:index/thumbnail': {
    controller: 'cloudant',
    action: 'thumbnail'
  },

  'delete /cloudant/:id': {
    controller: 'cloudant',
    action: 'del'
  },

  'get /cloudant/:id/:item/_design/:view/_geo/:index/preview': {
    controller: 'cloudant',
    action: 'preview'
  },

}
