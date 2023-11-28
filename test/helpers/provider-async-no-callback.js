class Model {
  async getData() {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-104.01, 39.94],
          },
        },
      ],
    };
  }
}

module.exports = {
  type: 'provider',
  name: 'async-no-callback',
  hosts: false,
  disableIdParam: true,
  Model,
  version: '0.0.1',
};
