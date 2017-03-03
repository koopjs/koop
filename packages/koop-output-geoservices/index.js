var FeatureServer = require('featureserver')

function Geoservices () {}

Geoservices.prototype.featureServer = function (req, res) {
  // model will be available when this is instantiated with the Koop controller
  this.model.pull(req, function (err, data) {
    if (err) res.status(500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

Geoservices.routes = [
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

Geoservices.type = 'output'
Geoservices.version = require('./package.json').version

module.exports = Geoservices
