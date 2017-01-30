function Fake () {
  this.find = function find (id, options, callback) {
    callback(null, [{}])
  }
}

module.exports = Fake
