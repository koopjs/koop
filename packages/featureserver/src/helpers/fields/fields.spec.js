const should = require('should');
should.config.checkProtoEql = false;
const Fields = require('./fields');

describe('Fields', () => {
  describe('static normalizeOptions method', () => {
    it('should defer to fieldsDefinitions when supplied', () => {
      const { fieldDefinitions } = Fields.normalizeOptions({
        fieldDefinitions: 'foo',
        fields: 'bar',
        metadata: {
          fields: 'snafu',
        },
      });

      fieldDefinitions.should.equal('foo');
    });

    it('should defer to root-level "fields" when supplied', () => {
      const { fieldDefinitions } = Fields.normalizeOptions({
        fields: 'bar',
        metadata: {
          fields: 'snafu',
        },
      });

      fieldDefinitions.should.equal('bar');
    });

    it('should use "metadata.fields" when supplied', () => {
      const { fieldDefinitions } = Fields.normalizeOptions({
        metadata: {
          fields: 'snafu',
        },
      });

      fieldDefinitions.should.equal('snafu');
    });

    it('should defer to root-level "idField" when supplied', () => {
      const { idField } = Fields.normalizeOptions({
        idField: 'bar',
        metadata: {
          idField: 'snafu',
        },
      });

      idField.should.equal('bar');
    });

    it('should use "metadata.idField" when supplied', () => {
      const { idField } = Fields.normalizeOptions({
        metadata: {
          idField: 'snafu',
        },
      });

      idField.should.equal('snafu');
    });

    it('should defer to root-level "attributeSample" when supplied', () => {
      const { attributeSample } = Fields.normalizeOptions({
        attributeSample: 'bar',
      });

      attributeSample.should.equal('bar');
    });

    it('should acquire "attributeSample" from features[0].attributes', () => {
      const { attributeSample } = Fields.normalizeOptions({
        features: [
          { attributes: { name: 'foo' } },
          { attributes: { name: 'bar' } },
        ],
      });

      attributeSample.should.deepEqual({ name: 'foo' });
    });

    it('should acquire "attributeSample" from features[0].properties', () => {
      const { attributeSample } = Fields.normalizeOptions({
        features: [
          { properties: { name: 'foo' } },
          { properties: { name: 'bar' } },
        ],
      });

      attributeSample.should.deepEqual({ name: 'foo' });
    });

    it('should have "attributeSample" default to empty object', () => {
      const { attributeSample } = Fields.normalizeOptions({
        features: [],
      });

      attributeSample.should.deepEqual({});
    });
  });

  describe('constructor', () => {
    it('should set fields from definitions, add OBJECTID', () => {
      const fields = new Fields({
        fieldDefinitions: [{ name: 'foo', type: 'String' }],
      });

      fields.should.deepEqual({
        fields: [
          {
            name: 'OBJECTID',
            type: 'esriFieldTypeOID',
            alias: 'OBJECTID',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'foo',
            type: 'esriFieldTypeString',
            alias: 'foo',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
      });
    });

    it('should set fields from definitions, including OBJECTID', () => {
      const fields = new Fields({
        fieldDefinitions: [
          { name: 'foo', type: 'String' },
          { name: 'OBJECTID', type: 'Integer' },
        ],
      });

      fields.should.deepEqual({
        fields: [
          {
            name: 'OBJECTID',
            type: 'esriFieldTypeOID',
            alias: 'OBJECTID',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'foo',
            type: 'esriFieldTypeString',
            alias: 'foo',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
      });
    });

    it('should set fields from definitions, noting idField as OBJECTID', () => {
      const fields = new Fields({
        idField: 'bar',
        fieldDefinitions: [
          { name: 'foo', type: 'String' },
          { name: 'bar', type: 'Integer' },
        ],
      });

      fields.should.deepEqual({
        fields: [
          {
            name: 'bar',
            type: 'esriFieldTypeOID',
            alias: 'bar',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'foo',
            type: 'esriFieldTypeString',
            alias: 'foo',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
      });
    });

    it('should set fields from attributeSample, add OBJECTID', () => {
      const fields = new Fields({
        attributeSample: { foo: 'bar' },
      });

      fields.should.deepEqual({
        fields: [
          {
            name: 'OBJECTID',
            type: 'esriFieldTypeOID',
            alias: 'OBJECTID',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'foo',
            type: 'esriFieldTypeString',
            alias: 'foo',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
      });
    });

    it('should set fields from attributeSample, use included OBJECTID', () => {
      const fields = new Fields({
        attributeSample: { OBJECTID: 1234, foo: 'bar' },
      });

      fields.should.deepEqual({
        fields: [
          {
            name: 'OBJECTID',
            type: 'esriFieldTypeOID',
            alias: 'OBJECTID',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'foo',
            type: 'esriFieldTypeString',
            alias: 'foo',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
      });
    });

    it('should set fields from attributeSample, use included OBJECTID', () => {
      const fields = new Fields({
        idField: 'hello',
        attributeSample: { hello: 1234, foo: 'bar' },
      });

      fields.should.deepEqual({
        fields: [
          {
            name: 'hello',
            type: 'esriFieldTypeOID',
            alias: 'hello',
            sqlType: 'sqlTypeInteger',
            domain: null,
            defaultValue: null,
          },
          {
            name: 'foo',
            type: 'esriFieldTypeString',
            alias: 'foo',
            sqlType: 'sqlTypeOther',
            domain: null,
            defaultValue: null,
            length: 128,
          },
        ],
      });
    });
  });
});
