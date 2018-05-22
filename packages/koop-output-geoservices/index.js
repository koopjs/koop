var FeatureServer = require('featureserver')

function Geoservices () {}

Geoservices.prototype.featureServer = async function (req, res) {
  // Is model configured for token-authorization?
  if (typeof this.model.authorize === 'function') {
    try {
      // Does request have a valid authorization token?
      await this.model.authorize(req.query.token)
    } catch (err) {
      // Respond with an authorization error
      return FeatureServer.error.authorization(res)
    }
  }
  // model will be available when this is instantiated with the Koop controller
  this.model.pull(req, function (err, data) {
    if (err) res.status(err.code || 500).json({error: err.message})
    else FeatureServer.route(req, res, data)
  })
}

/**
 * Handler for the $namepace/rest/info route. Inspects model for authentation info and passes any on to the
 * FeatureServer handler
 * @param {*} req
 * @param {*} res
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
 * @param {*} req
 * @param {*} res
 */
Geoservices.prototype.generateToken = async function (req, res) {
  // Is model configured for authentication?
  if (typeof this.model.authenticate === 'function') {
    try {
      // Does request successfully authenticate?
      let tokenJson = await this.model.authenticate(req.query.username, req.query.password)
      // Pass on to FeatureServer for request response formatting
      FeatureServer.authenticate(res, tokenJson)
    } catch (err) {
      // Respond with an authentication error
      return FeatureServer.error.authentication(res)
    }
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
