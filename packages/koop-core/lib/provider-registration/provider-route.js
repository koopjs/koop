const Joi = require('@hapi/joi')
const routeJoiner = require('./helpers/route-joiner')

const METHODS_SCHEMA = Joi.array().items(Joi.string().valid('get', 'post', 'patch', 'put', 'delete', 'head').insensitive())

/**
 * Properties/methods used to define Koop provider routes
 */
class ProviderRoute {
  static create (params) {
    const providerRoute = new ProviderRoute(params)
    providerRoute.addRouteToServer(params.server)
    return providerRoute
  }

  constructor (params) {
    Object.assign(this, params)
    this.validateHttpMethods()
    this.validateController()
    this.routeHandler = this.controller[this.handler].bind(this.controller)
  }

  validateController () {
    const {
      handler,
      path,
      controller
    } = this
    if (!controller[handler]) throw new Error(`Handler "${handler}" assigned to route "${path}" by the "${controller.namespace}" plugin is undefined for the Koop controller`)
  }

  validateHttpMethods () {
    const result = METHODS_SCHEMA.validate(this.methods)
    if (result.error) throw new Error(`One or more route methods is not supported; ${result.error}`)
  }

  addRouteToServer (server) {
    this.registeredPath = this.getRoutePath()
    this.methods.forEach(method => {
      server[method.toLowerCase()](this.registeredPath, this.routeHandler)
    })
  }

  getRoutePath (path) {
    return routeJoiner(this.routePrefix, this.path)
  }
}

module.exports = ProviderRoute
