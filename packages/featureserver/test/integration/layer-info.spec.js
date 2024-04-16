const FeatureServer = require('../../src');
const data = require('./fixtures/snow.json');
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
    it('should assign esriFieldTypeOID to the idField', () => {
      const input = {
        metadata: {
          idField: 'test',
          geometryType: 'Polygon',
          extent: [
            [11, 12],
            [13, 14],
          ],
          fields: [
            {
              name: 'test',
              type: 'integer',
            },
          ],
        },
      };
      const layer = FeatureServer.layerInfo(input, {});
      layer.fields[0].type.should.equal('esriFieldTypeOID');
    });

    it('should assign field length from metadata', () => {
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

  describe('when overriding params in a feature service', () => {
    it('should return changed values', () => {
      data.name = 'Snow';
      data.description = 'MyTestDesc';
      const service = FeatureServer.layerInfo(data, {});
      service.should.be.an.instanceOf(Object);
      service.name.should.equal(data.name);
      service.description.should.equal(data.description);
    });
  });
});
