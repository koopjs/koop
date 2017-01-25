var FeatureServer = require('featureserver')

function Plugin () {}

Plugin.prototype.featureServer = function (req, res) {
  // model will be available when this is instantiated with the Koop controller
  this.model.getData(req, function (err, data) {
    if (err) res.status(500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

Plugin.routes = [
  {
    path: 'FeatureServer/:layer/:method',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  }
]

Plugin.dependencies = 'cache'
Plugin.plugin_name = 'FeatureServer'
Plugin.type = 'output'
Plugin.version = require('./package.json').version

module.exports = Plugin
