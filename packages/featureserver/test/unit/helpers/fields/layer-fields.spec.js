const should = require('should') // eslint-disable-line
should.config.checkProtoEql = false;
const LayerFields = require('../../../../lib/helpers/fields/layer-fields');

describe('LayerFields', () => {
  it('create fields from definitions, adds OBJECTID', () => {
    const result = LayerFields.create({
      fields: [
        { name: 'foo', type: 'String' }
      ]
    });
    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from definitions, assign idField as OBJECTID', () => {
    const result = LayerFields.create({
      fields: [
        { name: 'foo', type: 'Integer' }
      ],
      idField: 'foo'
    });
    result.should.deepEqual([{
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from attributes sample, adds OBJECTID', () => {
    const result = LayerFields.create({
      attributeSample: {
        foo: 'bar'
      }
    });
    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from attributes sample, finds and uses OBJECTID', () => {
    const result = LayerFields.create({
      attributeSample: {
        foo: 'bar',
        OBJECTID: 1
      }
    });
    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from attributes sample, adds OBJECTID', () => {
    const result = LayerFields.create({
      attributeSample: {
        foo: 'bar'
      }
    });
    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from geojson data, adds OBJECTID', () => {
    const result = LayerFields.create({
      features: [{
        properties: {
          foo: 'bar'
        }
      }]
    });

    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from geojson data, finds and uses OBJECTID', () => {
    const result = LayerFields.create({
      features: [{
        properties: {
          OBJECTID: 1,
          foo: 'bar'
        }
      }]
    });

    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from esri json data, adds OBJECTID', () => {
    const result = LayerFields.create({
      features: [{
        attributes: {
          foo: 'bar'
        }
      }]
    });

    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });

  it('create fields from esri json data, finds and uses OBJECTID', () => {
    const result = LayerFields.create({
      features: [{
        attributes: {
          OBJECTID: 1,
          foo: 'bar'
        }
      }]
    });

    result.should.deepEqual([{
      name: 'OBJECTID',
      alias: 'OBJECTID',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }, {
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false
    }]);
  });
});
