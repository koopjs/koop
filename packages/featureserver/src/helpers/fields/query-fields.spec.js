const should = require('should');
should.config.checkProtoEql = false;
const QueryFields = require('./query-fields');

describe('QueryFields', () => {
  it('create fields from definitions, adds OBJECTID', () => {
    const result = QueryFields.create({
      fields: [{ name: 'foo', type: 'String' }],
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from definitions, assign idField as OBJECTID', () => {
    const result = QueryFields.create({
      fields: [{ name: 'foo', type: 'Integer' }],
      idField: 'foo',
    });
    result.should.deepEqual([
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from attributes sample, adds OBJECTID', () => {
    const result = QueryFields.create({
      attributeSample: {
        foo: 'bar',
      },
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from attributes sample, finds and uses OBJECTID', () => {
    const result = QueryFields.create({
      attributeSample: {
        foo: 'bar',
        OBJECTID: 1,
      },
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from attributes sample, adds OBJECTID', () => {
    const result = QueryFields.create({
      attributeSample: {
        foo: 'bar',
      },
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from geojson data, adds OBJECTID', () => {
    const result = QueryFields.create({
      features: [
        {
          properties: {
            foo: 'bar',
          },
        },
      ],
    });

    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from geojson data, finds and uses OBJECTID', () => {
    const result = QueryFields.create({
      features: [
        {
          properties: {
            OBJECTID: 1,
            foo: 'bar',
          },
        },
      ],
    });

    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from esri json data, adds OBJECTID', () => {
    const result = QueryFields.create({
      features: [
        {
          attributes: {
            foo: 'bar',
          },
        },
      ],
    });

    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('create fields from esri json data, finds and uses OBJECTID', () => {
    const result = QueryFields.create({
      features: [
        {
          attributes: {
            OBJECTID: 1,
            foo: 'bar',
          },
        },
      ],
    });

    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('outFields option filters fields array', () => {
    const result = QueryFields.create({
      fields: [
        { name: 'foo', type: 'String' },
        { name: 'bar', type: 'String' },
        { name: 'hello', type: 'String' },
      ],
      outFields: 'foo,hello',
    });
    result.should.deepEqual([
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
      {
        name: 'hello',
        alias: 'hello',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('outFields wildcard does not filter fields array', () => {
    const result = QueryFields.create({
      fields: [
        { name: 'foo', type: 'String' },
        { name: 'hello', type: 'String' },
      ],
      outFields: '*',
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
      {
        name: 'hello',
        alias: 'hello',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('outFields empty string does not filter fields array', () => {
    const result = QueryFields.create({
      fields: [
        { name: 'foo', type: 'String' },
        { name: 'hello', type: 'String' },
      ],
      outFields: '',
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
      {
        name: 'hello',
        alias: 'hello',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });

  it('outFields null value does not filter fields array', () => {
    const result = QueryFields.create({
      fields: [
        { name: 'foo', type: 'String' },
        { name: 'hello', type: 'String' },
      ],
      outFields: null,
    });
    result.should.deepEqual([
      {
        name: 'OBJECTID',
        alias: 'OBJECTID',
        type: 'esriFieldTypeOID',
        sqlType: 'sqlTypeInteger',
        domain: null,
        defaultValue: null,
      },
      {
        name: 'foo',
        alias: 'foo',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
      {
        name: 'hello',
        alias: 'hello',
        type: 'esriFieldTypeString',
        sqlType: 'sqlTypeOther',
        length: 128,
        domain: null,
        defaultValue: null,
      },
    ]);
  });
});
