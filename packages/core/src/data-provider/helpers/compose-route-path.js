const routeJoiner = require('./route-joiner');
const PROVIDER_PARAMS_PLACEHOLDER = '$providerParams';
const PROVIDER_NAMESPACE_PLACEHOLDER = '$namespace';

function composeRoutePath(params) {
  const {
    hosts,
    disableIdParam,
    routePrefix = '',
    providerNamespace = '',
    absolutePath,
    path,
  } = params;

  // No compostion needed if flagged as an absolute route
  if (absolutePath) {
    return routeJoiner(routePrefix, path);
  }

  const providerParamsFragment = getProviderParamsFragment(hosts, disableIdParam);

  if (path.includes('$namespace') || path.includes('$providerParams')) {
    const paramsPath = path
      .replace(PROVIDER_PARAMS_PLACEHOLDER, providerParamsFragment)
      .replace(PROVIDER_NAMESPACE_PLACEHOLDER, providerNamespace);
    return routeJoiner(routePrefix, paramsPath);
  }

  return routeJoiner(routePrefix, providerNamespace, providerParamsFragment, path);
}

function getProviderParamsFragment(hosts, disableIdParam) {
  if (hosts && !disableIdParam) {
    return ':host/:id';
  }

  if (hosts && disableIdParam) {
    return ':host';
  }

  if (!disableIdParam) {
    return ':id';
  }

  return '';
}

module.exports = composeRoutePath;
