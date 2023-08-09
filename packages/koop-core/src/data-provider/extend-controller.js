class DefaultController {}

/**
 * We extend all controllers to ensure the following properties exist: this.model, this.routes, this.namespace
 */
module.exports = function extendController (model, BaseController = DefaultController, options) {
  class Controller extends BaseController {
    constructor (model, options) {
      super(model, options);
      this.model = model;
    }
  }
  const controller = new Controller(model, options);
  const controllerEnumerables = Object.keys(BaseController).reduce((acc, member) => {
    acc[member] = BaseController[member];
    return acc;
  }, {});
  Object.assign(controller, controllerEnumerables);

  controller.routes = controller.routes || [];
  controller.namespace = BaseController.name || 'UndefinedControllerNamespace';

  return controller;
};
