function Fake () {
  this.find = function find (id, options, callback) {
    callback(null, [{}])
  }
}

Fake.prototype.getData = function getData (req, callback) {
  callback(null, {
    type: 'FeatureCollection',
    features: []
  })
}
module.exports = Fake
