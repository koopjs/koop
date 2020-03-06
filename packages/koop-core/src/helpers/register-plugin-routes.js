const _ = require('lodash')
const validateHttpMethods = require('./validate-http-methods')
const composeRouteString = require('./compose-route-string')

function registerProviderRoutes ({ provider, controller, server, pluginRoutes }, options = {}) {
  const namespace = provider.namespace.replace(/\s/g, '').toLowerCase()
  const { hosts, disableIdParam } = provider
  const { routePrefix } = options
  const routeMap = {}

  pluginRoutes.forEach(route => {
    const { path, methods, absolutePath, output } = route
    validateHttpMethods(methods)

    const routeString = composeRouteString(path, namespace, {
      hosts,
      disableIdParam,
      absolutePath,
      routePrefix
    })

    registerRoutes({
      server,
      routeString,
      methods,
      controller: bindController({ controller, route, namespace })
    })

    // For each output plugin, keep track of routes, methods
    addMethodsToRouteMap(routeMap, `${output}.${routeString}`, methods)
  })

  return routeMap
}

function bindController (params) {
  const { controller, route: { handler, path, output } } = params

  if (!controller[handler]) throw new Error(`Handler "${handler}" assigned to route "${path}" by the "${output}" plugin is undefined for the Koop controller`)
  return controller[handler].bind(controller)
}

function registerRoutes (params) {
  const {
    server,
    routeString,
    methods,
    controller
  } = params

  methods.forEach(method => {
    server[method.toLowerCase()](routeString, controller)
  })
}

function addMethodsToRouteMap (map, path, methods) {
  const existingMethods = _.get(map, path, [])
  _.set(map, path, _.concat(existingMethods, methods))
}

module.exports = registerProviderRoutes
