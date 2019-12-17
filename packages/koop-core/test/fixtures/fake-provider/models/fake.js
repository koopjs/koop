function Fake () {
  this.find = function find (id, options, callback) {
    callback(null, [{}])
  }

  this.getData = function getData (req, callback) {
    callback(null, {
      type: 'FeatureCollection',
      features: []
    })
  }
}

module.exports = Fake
