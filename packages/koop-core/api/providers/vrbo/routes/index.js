module.exports = {
  'get /vrbo': {
    controller: 'vrbo',
    action: 'index'
  }, 

  'get /vrbo/:minx/:miny/:maxx/:maxy': {
    controller: 'vrbo',
    action: 'get'
  },

  'get /vrbo/:minx/:miny/:maxx/:maxy/FeatureServer': {
    controller: 'vrbo',
    action: 'featureservice'
  },

  'get /vrbo/:minx/:miny/:maxx/:maxy/FeatureServer/:layer': {
    controller: 'vrbo',
    action: 'featureservice'
  },

  'get /vrbo/:minx/:miny/:maxx/:maxy/FeatureServer/:layer/:method': {
    controller: 'vrbo',
    action: 'featureservice'
  },

  'get /vrbo/:minx/:miny/:maxx/:maxy/preview' : {
    controller  : 'vrbo',
    action: 'preview'
  }
};
