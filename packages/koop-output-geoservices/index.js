var FeatureServer = require('featureserver')

function Geoservices () {}

/**
 * Helper for pulling data and routing to FeatureServer
 * @param {object} model provider's model
 * @param {object} req request object
 * @param {object} res response object
 */
function pullDataAndRoute (model, req, res) {
  model.pull(req, function (err, data) {
    if (err) res.status(err.code || 500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

/**
 * Handler for service, layer, and query routes
 * @param {object} req request object
 * @param {object} res response object
 */
Geoservices.prototype.featureServer = function (req, res) {
  // Is model configured for token-authorization?
  if (typeof this.model.authorize === 'function') {
    this.model.authorize(req.query.token)
      .then(valid => {
        // model will be available when this is instantiated with the Koop controller
        pullDataAndRoute(this.model, req, res)
      })
      .catch(err => {
        if (err.code === 401) FeatureServer.error.authorization(res)
        else res.status(err.code || 500).json({error: err.message})
      })
  } else {
    pullDataAndRoute(this.model, req, res)
  }
}

/**
 * Handler for the $namepace/rest/info route. Inspects model for authentation info and passes any on to the
 * FeatureServer handler
 * @param {object} req request object
 * @param {object} res response object
 */
Geoservices.prototype.featureServerRestInfo = function (req, res) {
  let authInfo = {}
  // Inspect model for an "authenticationSpecification" function; if undefined create a dummy function that returns an empty object
  let getAuthSpec = this.model.authenticationSpecification || function () { return {} }
  let authSpec = getAuthSpec()
  if (authSpec.secured) {
    authInfo.isTokenBasedSecurity = true
    authInfo.tokenServicesUrl = `${req.protocol}://${req.headers.host}/${authSpec.provider}/rest/generateToken`
  }
  FeatureServer.route(req, res, { authInfo })
}

/**
 * Handler for $namespace/authenticate route. Passes request and response object to the model's "authenticate" function
 * @param {object} req request object
 * @param {object} res response object
 */
Geoservices.prototype.generateToken = function (req, res) {
  // Is model configured for authentication?
  if (typeof this.model.authenticate === 'function') {
    this.model.authenticate(req.query.username, req.query.password)
      .then(tokenJson => {
        FeatureServer.authenticate(res, tokenJson)
      })
      .catch(err => {
        if (err.code === 401) FeatureServer.error.authentication(res)
        else res.status(err.code || 500).json({error: err.message})
      })
  } else {
    res.status(500).json({error: `"authenticate" not implemented for this provider`})
  }
}

/**
 * Collection of route objects that define geoservices
 *
 * These routes are bound to the Koop API for each provider. Note that FeatureServer,
 * FeatureServer/layers, FeatureServer/:layer, and FeatureServer/:layer/:method are found
 * in the collection with and without the "$namespace/rest/services/$providerParams" prefix.
 * These prefixed routes have been added due to some clients requiring the "rest/services"
 * URL fragment in geoservices routes. The $namespace and $providerParams are placeholders
 * that koop-core replaces with provider-specific settings.
 */
Geoservices.routes = [
  {
    path: '$namespace/rest/info',
    methods: ['get', 'post'],
    handler: 'featureServerRestInfo'
  },
  {
    path: '$namespace/rest/generateToken',
    methods: ['get', 'post'],
    handler: 'generateToken'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
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
