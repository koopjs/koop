const chalk = require('chalk')
const Table = require('easy-table')

module.exports = function (namespace, routes) {
  if (process.env.NODE_ENV === 'test') return

  const { providerRouteMap, pluginRouteMap } = routes
  printProviderRoutes(namespace, providerRouteMap)
  printPluginRoutes(namespace, pluginRouteMap)
}

function printProviderRoutes (namespace, providerRouteMap) {
  if (process.env.NODE_ENV === 'test') return

  // Print provider routes
  const table = new Table()
  Object.keys(providerRouteMap).forEach((key) => {
    table.cell(chalk.cyan(`"${namespace}" provider routes`), chalk.yellow(key))
    table.cell(chalk.cyan('Methods'), chalk.green(providerRouteMap[key].join(', ').toUpperCase()))
    table.newRow()
  })
  console.log(`\n${table.toString()}`)
}

function printPluginRoutes (namespace, pluginRouteMap) {
  // Print output plugin routes
  Object.keys(pluginRouteMap).forEach(key => {
    const table = new Table()
    Object.keys(pluginRouteMap[key]).forEach(routeKey => {
      table.cell(chalk.cyan(`"${key}" output routes for the "${namespace}" provider`), chalk.yellow(routeKey))
      table.cell(chalk.cyan('Methods'), chalk.green(pluginRouteMap[key][routeKey].join(', ').toUpperCase()))
      table.newRow()
    })
    console.log(`\n${table.toString()}`)
  })
}
