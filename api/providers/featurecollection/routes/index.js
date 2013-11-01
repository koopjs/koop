module.exports = {
  'get /featurecollection/proxy': {
    controller: 'featurecollection',
    action: 'proxy'
  },
  
  'get /featurecollection/proxy/FeatureServer/:layer/:method': {
    controller: 'featurecollection',
    action: 'featureservice'
  },

  'get /featurecollection/proxy/FeatureServer/:layer': {
    controller: 'featurecollection',
    action: 'featureservice'
  },
  
  'get /featurecollection/proxy/FeatureServer': {
    controller: 'featurecollection',
    action: 'featureservice'
  },

}
