class Model {
  async getData(req, callback) {
    return callback(null, {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            OBJECTID: 1,
          },
          geometry: {
            type: 'Point',
            coordinates: [-104.01, 39.94],
          },
        },
      ],
    });
  }
}

module.exports = {
  type: 'provider',
  name: 'async-with-callback',
  hosts: false,
  disableIdParam: true,
  Model,
  version: '0.0.1',
};
