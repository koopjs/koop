const routeJoiner = require('./route-joiner')
const KOOP_PARAMS_PLACEHOLDER = '$providerParams'
const PROVIDER_NAMESPACE_PLACEHOLDER = '$namespace'

function namespacedRoutePath (params) {
  const {
    hosts,
    disableIdParam,
    routePrefix = '',
    namespace = '',
    absolutePath,
    path

  } = params

  // No compostion needed if flagged as an absolute route
  if (absolutePath) return routeJoiner(routePrefix, path)

  const koopParams = getKoopParams(hosts, disableIdParam)

  if (path.includes('$namespace') || path.includes('$providerParams')) {
    const paramsPath = path.replace(KOOP_PARAMS_PLACEHOLDER, koopParams).replace(PROVIDER_NAMESPACE_PLACEHOLDER, namespace)
    return routeJoiner(routePrefix, paramsPath)
  }

  return routeJoiner(routePrefix, namespace, koopParams, path)
}

function getKoopParams (hosts, disableIdParam) {
  if (hosts && !disableIdParam) return ':host/:id'
  else if (hosts && disableIdParam) return ':host'
  else if (!disableIdParam) return ':id'
  else return ''
}

module.exports = namespacedRoutePath
