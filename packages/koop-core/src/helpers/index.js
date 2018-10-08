const path = require('path')

/**
 * Compose route string based on inputs and options
 * @param {string} routePath - initial route pathfragment
 * @param {string} namespace - namespace for the route
 * @param {object} options - options object with decoration flags
 */
function composeRouteString (routePath, namespace, options = {}) {
  const { hosts, disableIdParam, absolutePath, routePrefix = '' } = options
  let paramFragment = ''
  const paramsPlaceholder = '$providerParams'
  const namespacePlaceholder = '$namespace'

  // No compostion needed if flagged as an absolute route
  if (absolutePath) return path.posix.join(routePrefix, '/', routePath)

  // Build parameterized route fragment based on provider options
  if (hosts && !disableIdParam) paramFragment = path.posix.join(':host', ':id')
  else if (hosts && disableIdParam) paramFragment = path.posix.join(':host')
  else if (!disableIdParam) paramFragment = path.posix.join(':id')

  // Replace placehold substrings if present, fallback to namespace/:host/:id
  if (routePath.includes(namespacePlaceholder) && routePath.includes(paramsPlaceholder)) {
    return path.posix.join(routePrefix, '/', routePath.replace(namespacePlaceholder, namespace).replace(paramsPlaceholder, paramFragment))
  } else if (routePath.includes(namespacePlaceholder)) {
    return path.posix.join(routePrefix, '/', routePath.replace(namespacePlaceholder, namespace))
  } else if (routePath.includes(paramsPlaceholder)) {
    return path.posix.join(routePrefix, '/', namespace, routePath.replace(paramsPlaceholder, paramFragment))
  } else {
    return path.posix.join(routePrefix, '/', namespace, paramFragment, routePath)
  }
}
module.exports = { composeRouteString }
