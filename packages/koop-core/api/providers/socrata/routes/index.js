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

  'delete /socrata/:id': {
    controller: 'socrata',
    action: 'del'
  }

}
