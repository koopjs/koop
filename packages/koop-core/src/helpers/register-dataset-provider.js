const registerProviderRoutes = require('./register-provider-routes')
const registerPluginRoutes = require('./register-plugin-routes')
const consolePrinting = require('./console-printing')
const DatasetController = require('../controllers/dataset')
const Dataset = require('../models/dataset')

module.exports = function registerDatasetProvider ({ koop, routes }, options) {
  const dataset = new Dataset(koop)
  const controller = new DatasetController(dataset)
  const provider = { namespace: 'datasets', routes }
  const providerRouteMap = registerProviderRoutes({ provider, controller, server: koop.server }, options)
  const pluginRouteMap = registerPluginRoutes({ provider, controller, server: koop.server, pluginRoutes: koop.pluginRoutes }, options)
  consolePrinting('datasets', { providerRouteMap, pluginRouteMap })
}
