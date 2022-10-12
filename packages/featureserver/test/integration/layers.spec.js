const FeatureServer = require('../..');
const data = require('./fixtures/snow.json');
const should = require('should');
should.config.checkProtoEql = false;
const _ = require('lodash');
const Joi = require('joi');
const { layerTemplateSchema } = require('./schemas');

describe('Layers operations', () => {
  describe('layers info', () => {
    it('should conform to the prescribed schema', () => {
      const layers = FeatureServer.layersInfo(data);
      const layerSchemaOverride = layerTemplateSchema.append({
        extent: Joi.object().keys({
          xmin: Joi.number().valid(-108.9395),
          ymin: Joi.number().valid(37.084968),
          xmax: Joi.number().valid(-102),
          ymax: Joi.number().valid(40.8877),
          spatialReference: Joi.object().keys({
            wkid: Joi.number().valid(4326),
            latestWkid: Joi.number().valid(4326)
          })
        }),
        geometryType: Joi.string().allow('point'),
        drawingInfo: Joi.object().keys({
          renderer: Joi.object().keys({
            type: Joi.string().allow('simple')
          }).unknown() // TODO expand these?
        }).unknown() // TODO expand these?
      });
      const layersTemplateSchema = Joi.object({
        layers: Joi.array().items(layerSchemaOverride),
        tables: Joi.array().empty()
      });
      layersTemplateSchema.validate(layers, { presence: 'required' }).should.not.have.property('error');
    });

    it('should work with geojson passed in', () => {
      const layers = FeatureServer.layersInfo(data);
      layers.layers.length.should.equal(1);
      layers.tables.length.should.equal(0);
    });

    it('should support a passed in metadata', () => {
      const input = _.cloneDeep(data);
      input.metadata = {
        foo: 'bar',
        displayField: 'myField',
        copyrightText: 'Custom copyright text',
        capabilities: 'list,of,stuff'
      };
      const layers = FeatureServer.layersInfo(input);
      layers.layers.length.should.equal(1);
      layers.layers[0].should.not.have.property('foo');
      layers.layers[0].displayField.should.equal('myField');
      layers.layers[0].copyrightText.should.equal('Custom copyright text');
      layers.layers[0].capabilities.should.equal('list,of,stuff');
    });
  });
});
