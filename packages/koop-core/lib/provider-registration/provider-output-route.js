
const ProviderRoute = require('./provider-route')
const namespacedRoutePath = require('./helpers/namespaced-route-path')

/**
 * Extends ProviderRoute to handle registration of output routes for each provider
 */
class ProviderOutputRoute extends ProviderRoute {
  static create (params) {
    const providerRoute = new ProviderOutputRoute(params)
    providerRoute.addRouteToServer(params.server)
    return providerRoute
  }

  constructor (params) {
    super(params)
    const {
      hosts,
      disableIdParam
    } = params
    this.host = hosts
    this.disableIdParam = disableIdParam
  }

  getRoutePath () {
    return namespacedRoutePath(this)
  }
}

module.exports = ProviderOutputRoute
