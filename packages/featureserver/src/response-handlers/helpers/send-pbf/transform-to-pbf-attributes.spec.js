const should = require('should'); // eslint-disable-line
const { transformToPbfAttributes } = require('./transform-to-pbf-attributes');

const fields = [
  {
    name: 'FID',
    type: 'esriFieldTypeOID',
    alias: 'FID',
    sqlType: 'sqlTypeInteger',
    domain: null,
    defaultValue: null,
  },
  {
    name: 'OBJECTID',
    type: 'esriFieldTypeInteger',
    alias: 'OBJECTID',
    sqlType: 'sqlTypeInteger',
    domain: null,
    defaultValue: null,
  },
  {
    name: 'WARD',
    type: 'esriFieldTypeSmallInteger',
    alias: 'WARD',
    sqlType: 'sqlTypeSmallInt',
    domain: null,
    defaultValue: null,
  },
  {
    name: 'FACILITYID',
    type: 'esriFieldTypeString',
    alias: 'FACILITYID',
    sqlType: 'sqlTypeNVarchar',
    length: 30,
    domain: null,
    defaultValue: null,
  },
  {
    name: 'TBOX_L',
    type: 'esriFieldTypeDouble',
    alias: 'TBOX_L',
    sqlType: 'sqlTypeFloat',
    domain: null,
    defaultValue: null,
  },
  {
    name: 'CONDITIODT',
    type: 'esriFieldTypeDate',
    alias: 'CONDITIODT',
    sqlType: 'sqlTypeTimestamp2',
    length: 8,
    domain: null,
    defaultValue: null,
  },
  {
    name: 'GlobalID_2',
    type: 'esriFieldTypeGlobalID',
    alias: 'GlobalID_2',
    sqlType: 'sqlTypeOther',
    length: 38,
    domain: null,
    defaultValue: 'NEWID() WITH VALUES',
  },
];

const fieldMap = fields.reduce((acc, cur) => {
  acc[cur.name] = cur.type;
  return acc;
}, {});

const attributes = {
  FID: 1,
  OBJECTID: 46104019,
  WARD: 6,
  FACILITYID: '30040-085-3001-0126-000',
  TBOX_L: 99,
  CONDITIODT: 1421798400000,
  GlobalID_2: '9279699f-5ece-4ca6-8a3b-b559da37bc5e',
};

describe('transformToPbfAttributes', () => {
  it('should transform Esri JSON to Esri PBF JSON', () => {
    const result = transformToPbfAttributes(attributes, fieldMap);
    result.should.deepEqual([
      {
        sint64Value: 1421798400000,
      },
      {
        stringValue: '30040-085-3001-0126-000',
      },
      {
        uintValue: 1,
      },
      {
        stringValue: '9279699f-5ece-4ca6-8a3b-b559da37bc5e',
      },
      {
        sintValue: 46104019,
      },
      {
        doubleValue: 99,
      },
      {
        sintValue: 6,
      },
    ]);
  });

  it('should properly handle OIDs that are strings', () => {
    const result = transformToPbfAttributes({ ...attributes, FID: 'foo' }, fieldMap);
    result.should.deepEqual([
      {
        sint64Value: 1421798400000,
      },
      {
        stringValue: '30040-085-3001-0126-000',
      },
      {
        stringValue: 'foo',
      },
      {
        stringValue: '9279699f-5ece-4ca6-8a3b-b559da37bc5e',
      },
      {
        sintValue: 46104019,
      },
      {
        doubleValue: 99,
      },
      {
        sintValue: 6,
      },
    ]);
  });
});
