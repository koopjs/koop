const _ = require('lodash');
const Joi = require('joi');
const extendRouteController = require('./extend-controller');
const extendModel = require('./extend-model');
const ProviderRoute = require('./provider-route');

const providerOptionsSchema = Joi.object({
  cache: Joi.object()
    .keys({
      retrieve: Joi.function().arity(3).required(),
      insert: Joi.function().arity(3).required(),
    })
    .unknown(true)
    .optional(),
  routePrefix: Joi.string().optional(),
  before: Joi.function().arity(2).optional(),
  after: Joi.function().arity(3).optional(),
  name: Joi.string().optional(),
  defaultToOutputRoutes: Joi.boolean().optional(),
}).unknown(true);

module.exports = class DataProvider {
  #options;
  #providerController;
  #definedProviderRoutes;
  #outputPluginControllers;
  #urlSafeNamespace;
  #logger;

  constructor(params) {
    const {
      logger,
      cache,
      authModule,
      pluginDefinition,
      outputPlugins = [],
      options = {},
    } = params;

    this.namespace = getProviderName(pluginDefinition, options);
    this.#validateOptions(options);
    this.defaultToOutputRoutes = options.defaultToOutputRoutes || false;

    this.#options = {
      ...options,
      ..._.pick(pluginDefinition, 'hosts', 'disableIdParam'),
    };


    this.version =
      pluginDefinition.version ||
      pluginDefinition?.status?.version ||
      'unknown';

    this.#urlSafeNamespace = this.namespace
      .replace(/\s/g, '-')
      .toLowerCase();

    const model = extendModel(
      {
        ProviderModel: pluginDefinition.Model,
        namespace: this.namespace,
        logger, cache, authModule,
      },
      options,
    );

    this.#definedProviderRoutes = pluginDefinition.routes || [];

    this.#outputPluginControllers = outputPlugins.map(({ outputClass, options }) => {
      return extendRouteController(model, outputClass, options);
    });

    this.#providerController = extendRouteController(
      model,
      pluginDefinition.Controller,
    );

    this.#logger = logger;
    this.#createOutputRoutes();
    this.#createProviderRoutes();
  }

  addRoutesToServer(server) {
    if (this.defaultToOutputRoutes) {
      this.#addOutputRoutes(server);
      this.#addProviderRoutes(server);
      return;
    }

    this.#addProviderRoutes(server);
    this.#addOutputRoutes(server);
  }

  #createOutputRoutes() {
    this.outputPluginRoutes = this.#outputPluginControllers.map((controller) => {
      const routes = controller.routes.map((route) => {
        const { handler, path, methods } = route;
        
        const compositeRoute = new ProviderRoute({
          controller,
          handler,
          path,
          methods,
          providerNamespace: this.#urlSafeNamespace,
          outputNamespace: controller.namespace,
          hosts: this.#options.hosts,
          disableIdParam: this.#options.disableIdParam,
          routePrefix: this.#options.routePrefix,
          absolutePath: this.#options.absolutePath,
        });
        return compositeRoute;
      });

      return {
        namespace: controller.namespace,
        routes
      };
    });
  }

  #createProviderRoutes() {
    if (this.#definedProviderRoutes.length > 0) {
      this.#logger.info(`[${this.namespace}] defined routes:`);
    }

    this.providerRoutes = this.#definedProviderRoutes.map(
      (route) => {
        const { handler, path, methods } = route;
        const registeredRoute = new ProviderRoute({
          controller: this.#providerController,
          handler,
          path,
          methods,
          providerNamespace: this.#urlSafeNamespace,
          routePrefix: this.#options.routePrefix,
          absolutePath: true
        });
        this.#logger.info(`ROUTE | [${methods.join(', ').toUpperCase()}] | ${registeredRoute.path}`);
        return registeredRoute;
      },
    );
  }

  #addOutputRoutes (server) {
    this.outputPluginRoutes.forEach((output => {
      const { namespace: outputNamespace, routes } = output;
      this.#logger.info(
        `"${outputNamespace}" routes for the "${this.namespace}" provider:`,
      );
      this.#addRouteCollection(server, routes);
    }));
  }

  #addProviderRoutes (server) {
    if (this.providerRoutes.length > 0) {
      this.#logger.info(`[${this.namespace}] defined routes:`);
    }

    this.#addRouteCollection(server, this.providerRoutes);
  }

  #addRouteCollection (server, routes) {
    return routes.forEach(route =>{
      const { methods, path, handler } = route;
      methods.forEach(method => {
        server[method.toLowerCase()](path, handler);
      });

      this.#logger.info(
        `ROUTE | [${methods.join(', ').toUpperCase()}] | ${path}`,
      );
    });
  }

  #validateOptions(params) {
    const result = providerOptionsSchema.validate(params);
    if (result.error) {
      throw new Error(`Provider "${this.namespace}" has invalid option: ${result.error.details[0].message}`);
    }
  }
};

function getProviderName(provider, options) {
  return (
    options?.name ||
    provider.namespace ||
    provider.pluginName ||
    provider.plugin_name ||
    provider.name
  );
}