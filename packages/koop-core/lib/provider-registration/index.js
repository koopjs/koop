const chalk = require('chalk')
const Table = require('easy-table')
const _ = require('lodash')
const Joi = require('@hapi/joi')
const createController = require('./create-controller')
const createModel = require('./create-model')
const ProviderRoute = require('./provider-route')
const ProviderOutputRoute = require('./provider-output-route')

const providerOptionsSchema = Joi.object({
  cache: Joi.object().keys({
    retrieve: Joi.function().arity(3).required(),
    upsert: Joi.function().arity(3).required()
  }).unknown(true).optional(),
  routePrefix: Joi.string().optional(),
  before: Joi.function().arity(2).optional(),
  after: Joi.function().arity(3).optional(),
  name: Joi.string().optional(),
  defaultToOutputRoutes: Joi.boolean().optional()
}).unknown(true)

module.exports = class ProviderRegistration {
  static create (params) {
    const provider = new ProviderRegistration(params)
    provider.registerRoutes(params.koop.server)
    provider.logRoutes()
    return provider
  }

  constructor (params) {
    const {
      provider,
      koop,
      options = {}
    } = params

    validateOptions(options)

    this.options = { ...options, ..._.pick(provider, 'hosts', 'disableIdParam') }
    this.registerOutputRoutesFirst = _.get(options, 'defaultToOutputRoutes', false).toString() === 'true'
    this.namespace = getProviderName(provider, options)
    this.version = provider.version || _.get(provider, 'status.version', 'NA')
    this.outputRouteNamespace = this.namespace.replace(/\s/g, '-').toLowerCase()
    this.model = createModel({ ProviderModel: provider.Model, namespace: this.namespace, koop }, options)
    this.routes = provider.routes || []
    this.registeredOutputs = []
    this.outputs = koop.outputs.map(Output => {
      return createController(this.model, Output)
    })
    this.controller = createController(this.model, provider.Controller)
  }

  registerRoutes (server) {
    if (this.registerOutputRoutesFirst) {
      this.registerOutputPluginRoutes(server)
      this.registerProviderDefinedRoutes(server)
    } else {
      this.registerProviderDefinedRoutes(server)
      this.registerOutputPluginRoutes(server)
    }
  }

  registerOutputPluginRoutes (server) {
    const params = {
      ...this,
      ...this.options,
      namespace: this.outputRouteNamespace,
      server
    }
    this.registeredOutputs = this.outputs.map(output => {
      const routes = output.routes.map(route => {
        return ProviderOutputRoute.create({ ...params, controller: output, ...route })
      })
      return { namespace: output.namespace, routes }
    })

    this.registeredOutputsMetadata = this.registeredOutputs.map(output => {
      return {
        namespace: output.namespace,
        routes: output.routes.map(route => ({
          path: route.registeredPath,
          methods: route.methods
        }))
      }
    })
  }

  registerProviderDefinedRoutes (server) {
    const params = {
      ...this,
      ...this.options,
      server
    }
    this.registeredProviderRoutes = this.routes.map(route => {
      return ProviderRoute.create({ ...params, ...route })
    })

    this.providerRoutesMetadata = this.registeredProviderRoutes.map(route => ({
      path: route.registeredPath,
      methods: route.methods
    }))
  }

  registrationMetadata () {
    return {
      version: this.version,
      namespace: this.namespace,
      providerDefinedRoutes: this.providerRoutesMetadata,
      registeredOutputs: this.registeredOutputsMetadata
    }
  }

  logRoutes () {
    if (process.env.NODE_ENV === 'test' || process.env.KOOP_DISABLE_CONSOLE_ROUTES === 'true') return

    if (this.registerOutputRoutesFirst) {
      this.logOutputDefinedRoutes()
      this.logProviderDefinedRoutes()
    } else {
      this.logProviderDefinedRoutes()
      this.logOutputDefinedRoutes()
    }
  }

  logProviderDefinedRoutes () {
    const table = new Table()
    this.registeredProviderRoutes.forEach(route => {
      table.cell(chalk.cyan(`"${this.namespace}" provider routes`), chalk.yellow(route.registeredPath))
      table.cell(chalk.cyan('Methods'), chalk.green(route.methods.join(', ').toUpperCase()))
      table.newRow()
    })
    console.log(`\n${table.toString()}`)
  }

  logOutputDefinedRoutes () {
    this.registeredOutputs.forEach(output => {
      const table = new Table()
      output.routes.forEach(route => {
        table.cell(chalk.cyan(`"${output.namespace}" output routes for the "${this.namespace}" provider`), chalk.yellow(route.registeredPath))
        table.cell(chalk.cyan('Methods'), chalk.green(route.methods.join(', ').toUpperCase()))
        table.newRow()
      })
      console.log(`\n${table.toString()}`)
    })
  }
}

function getProviderName (provider, options) {
  return options.name || provider.namespace || provider.pluginName || provider.plugin_name || provider.name
}

function validateOptions (params) {
  const result = providerOptionsSchema.validate(params)
  if (result.error) throw new Error(`Provider options ${result.error}`)
}
