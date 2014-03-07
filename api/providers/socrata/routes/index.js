module.exports = {
  'post /socrata/register': {
    controller: 'socrata',
    action: 'register'
  },

  'get /socrata': {
    controller: 'socrata',
    action: 'list'
  },

  'get /socrata/:id': {
    controller: 'socrata',
    action: 'find'
  },

  'get /socrata/:id/:item.:format': {
    controller: 'socrata',
    action: 'findResource'
  },
  
  'get /socrata/:id/:item': {
    controller: 'socrata',
    action: 'findResource'
  },

  'get /socrata/:id/:item/FeatureServer/:layer/:method': {
    controller: 'socrata',
    action: 'featureserver'
  },

  'get /socrata/:id/:item/FeatureServer/:layer': {
    controller: 'socrata',
    action: 'featureserver'
  },

  'get /socrata/:id/:item/FeatureServer': {
    controller: 'socrata',
    action: 'featureserver'
  },

  
  'post /socrata/:id/:item/FeatureServer/:layer/:method': {
    controller: 'socrata',
    action: 'featureserver'
  },

  'post /socrata/:id/:item/FeatureServer/:layer': {
    controller: 'socrata',
    action: 'featureserver'
  },

  'post /socrata/:id/:item/FeatureServer': {
    controller: 'socrata',
    action: 'featureserver'
  },

  'get /socrata/:id/:item/thumbnail': {
    controller: 'socrata',
    action: 'thumbnail'
  },

  'delete /socrata/:id': {
    controller: 'socrata',
    action: 'del'
  },

  'get /socrata/:id/:item/preview': {
    controller: 'socrata',
    action: 'preview'
  },

}
