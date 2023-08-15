const Joi = require('joi');
const composeRoutePath = require('./helpers/compose-route-path');
const METHODS_SCHEMA = Joi.array().items(
  Joi.string()
    .valid('get', 'post', 'patch', 'put', 'delete', 'head')
    .insensitive(),
);

class ProviderRoute {

  constructor(params) {
    const { handler, path, controller, methods } = params;
    this.#validateHttpMethods(methods, path);
    this.#validateController(controller, handler, path);
    this.handler = handler;
    this.controller = controller;
    this.methods = methods;
    this.handler = this.controller[handler].bind(this.controller);
    this.path = composeRoutePath(params);
  }

  #validateController (controller, handler, path) {
    if (!controller[handler]) {
      throw new Error(
        `defines route "${path}" with unknown handler: ${handler}`,
      );
    }
  }

  #validateHttpMethods (methods, path) {
    const result = METHODS_SCHEMA.validate(methods);
    if (result.error) {
      throw new Error(
        `defines route "${path}" with unsupported HTTP method: ${result.value[0]}`,
      );
    }
  }
}

module.exports = ProviderRoute;
