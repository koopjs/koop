const should = require('should'); // eslint-disable-line
should.config.checkProtoEql = false;
const {
  FieldFromKeyValue,
  ObjectIdField,
  FieldFromFieldDefinition,
  ObjectIdFieldFromDefinition,
  StatisticField,
  StatisticDateField,
} = require('./field-classes');

describe('FieldFromKeyValue', () => {
  it('should produce expected instance', () => {
    const result = new FieldFromKeyValue('foo', 'bar');
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
    });

    result.setEditable().setNullable();
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false,
    });

    result.setEditable(true).setNullable(true);
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: true,
      nullable: true,
    });
  });
});

describe('ObjectIdField', () => {
  it('should produce expected instance', () => {
    const result = new ObjectIdField('idFoo');
    result.should.deepEqual({
      name: 'idFoo',
      alias: 'idFoo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
    });

    result.setEditable().setNullable();
    result.should.deepEqual({
      name: 'idFoo',
      alias: 'idFoo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false,
    });

    result.setEditable(true).setNullable(true);
    result.should.deepEqual({
      name: 'idFoo',
      alias: 'idFoo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: true,
      nullable: true,
    });
  });
});

describe('FieldFromFieldDefinition', () => {
  it('should produce expected instance from name, type definitions', () => {
    const result = new FieldFromFieldDefinition({
      name: 'foo',
      type: 'String',
    });
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
    });

    result.setEditable().setNullable();
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false,
    });

    result.setEditable(true).setNullable(true);
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      length: 128,
      domain: null,
      defaultValue: null,
      editable: true,
      nullable: true,
    });
  });

  it('should produce expected instance from name, type, plus all optional definitions', () => {
    const result = new FieldFromFieldDefinition({
      name: 'foo',
      type: 'String',
      alias: 'foolish',
      domain: 'domain-value',
      defaultValue: 'default-value',
      length: 256,
    });
    result.should.deepEqual({
      name: 'foo',
      alias: 'foolish',
      type: 'esriFieldTypeString',
      sqlType: 'sqlTypeOther',
      domain: 'domain-value',
      defaultValue: 'default-value',
      length: 256,
    });
  });
});

describe('ObjectIdFieldFromFieldDefinition', () => {
  it('should produce expected instance', () => {
    const result = new ObjectIdFieldFromDefinition({
      name: 'foo',
      type: 'String',
      editable: true,
      nullable: true,
    });
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
    });

    result.setEditable().setNullable();
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: false,
      nullable: false,
    });

    result.setEditable(true).setNullable(true);
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeOID',
      sqlType: 'sqlTypeInteger',
      domain: null,
      defaultValue: null,
      editable: true,
      nullable: true,
    });
  });
});

describe('StatisticsField', () => {
  it('should produce expected instance', () => {
    const result = new StatisticField('foo');
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeDouble',
      sqlType: 'sqlTypeFloat',
      domain: null,
      defaultValue: null,
    });
  });
});

describe('StatisticsDateField', () => {
  it('should produce expected instance', () => {
    const result = new StatisticDateField('foo');
    result.should.deepEqual({
      name: 'foo',
      alias: 'foo',
      type: 'esriFieldTypeDate',
      sqlType: 'sqlTypeOther',
      domain: null,
      defaultValue: null,
    });
  });
});
