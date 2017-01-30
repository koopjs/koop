function Controller (model) {
  this.model = model

  this.get = function (req, res) {
    res.send('hello')
  }

  this.featureserver = function (req, res) {
    res.send('hello fs')
  }
}

module.exports = Controller
