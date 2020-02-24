const path = require('path')
const validateHttpMethods = require('./validate-http-methods')

const composePath = (routePrefix, routeString) => path.posix.join(routePrefix, routeString)
function registerProviderRoutes ({ provider, controller, server }, options = {}) {
  const { routePrefix = '' } = options
  const { routes = [], namespace } = provider
  const providerRoutes = {}

  routes.forEach(route => {
    const { path, methods } = route
    validateHttpMethods(methods)

    const composedPath = composePath(routePrefix, path)

    registerRoutes({
      server,
      path: composedPath,
      methods,
      controller: bindController({ controller, route, namespace })
    })
    providerRoutes[composedPath] = methods
  })

  return providerRoutes
}

function bindController (params) {
  const { controller, route: { handler, path }, namespace } = params

  if (!controller[handler]) throw new Error(`Handler "${handler}" assigned to route "${path}" by the "${namespace}" provider is undefined for the Koop controller`)
  return controller[handler].bind(controller)
}

function registerRoutes (params) {
  const {
    server,
    path,
    methods,
    controller
  } = params

  methods.forEach(method => {
    server[method.toLowerCase()](path, controller)
  })
}

module.exports = registerProviderRoutes
