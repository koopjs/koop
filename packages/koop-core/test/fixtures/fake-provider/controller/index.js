var Controller = function (Model, BaseController) {
  var controller = {}

  if (typeof BaseController === 'function') {
    controller = BaseController()
  }

  controller.get = function (req, res) {
    res.send('hello')
  }

  controller.featureserver = function (req, res) {
    res.send('hello fs')
  }

  return controller

}

module.exports = Controller
