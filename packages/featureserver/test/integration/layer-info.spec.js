const FeatureServer = require('../../src');
const should = require('should');
const sinon = require('sinon');
should.config.checkProtoEql = false;

describe('LayerInfo operations', () => {
  const res = {
    status: sinon.spy(() => {
      return res;
    }),
    json: sinon.spy(),
  };

  beforeEach(() => {
    res.status.resetHistory();
    res.json.resetHistory();
  });

  describe('field computation', () => {
    it.skip('should assign field length from metadata', () => {
      const input = {
        metadata: {
          geometryType: 'Polygon',
          extent: [
            [11, 12],
            [13, 14],
          ],
          fields: [
            {
              name: 'test',
              type: 'String',
              length: 1000,
            },
          ],
        },
      };
      const layer = FeatureServer.layerInfo(input, {});
      layer.fields
        .find((f) => {
          return f.name === 'test';
        })
        .length.should.equal(1000);
    });
  });
});
