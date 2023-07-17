function Fake (koop, options) {
  this.options = options;
  this.find = function find (id, options, callback) {
    callback(null, [{}]);
  };
}

Fake.prototype.getData = function getData (req, callback) {
  callback(null, {
    type: 'FeatureCollection',
    features: []
  });
};

Fake.prototype.getLayer = function getData (req, callback) {
  callback(null, {
    layer: 'foo'
  });
};

Fake.prototype.getCatalog = function getData (req, callback) {
  callback(null, {
    catalog: 'foo'
  });
};

module.exports = Fake;
