const should = require('should'); // eslint-disable-line
const { transformFeaturesForPbf } = require('./transform-features-for-pbf');

const transformedFixture = {
  objectIdFieldName: 'FID',
  uniqueIdField: {
    name: 'FID',
    isSystemMaintained: true,
  },
  geometryType: 'esriGeometryTypePoint',
  spatialReference: {
    wkid: 102100,
    latestWkid: 3857,
  },
  fields: [
    {
      name: 'CONDITIODT',
      fieldType: 'esriFieldTypeDate',
      alias: 'CONDITIODT',
    },
    {
      name: 'FACILITYID',
      fieldType: 'esriFieldTypeString',
      alias: 'FACILITYID',
    },
    {
      name: 'FID',
      fieldType: 'esriFieldTypeOID',
      alias: 'FID',
    },
    {
      name: 'GlobalID_2',
      fieldType: 'esriFieldTypeGlobalID',
      alias: 'GlobalID_2',
    },
    {
      name: 'OBJECTID',
      fieldType: 'esriFieldTypeInteger',
      alias: 'OBJECTID',
    },
    {
      name: 'TBOX_L',
      fieldType: 'esriFieldTypeDouble',
      alias: 'TBOX_L',
    },
    {
      name: 'WARD',
      fieldType: 'esriFieldTypeSmallInteger',
      alias: 'WARD',
    },
  ],
  transform: {
    scale: {
      xScale: 0.0001,
      yScale: 0.0001,
    },
    translate: {
      xTranslate: 0,
      yTranslate: 0,
    },
  },
  features: [
    {
      attributes: [
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
      ],
      geometry: {
        lengths: [2],
        coords: [-85716573542, -47044113943],
      },
    },
  ],
};

describe('transform features for PBF', () => {
  it('convert Esri Point FeatureCollection to PBF-ready JSON', () => {
    const fixture = createFixture();
    const result = transformFeaturesForPbf(fixture);
    result.should.deepEqual(transformedFixture);
  });

  it('convert Esri Table FeatureCollection to PBF-ready JSON', () => {
    const fixture = createFixture();
    fixture.geometryType = undefined;
    const result = transformFeaturesForPbf(fixture);
    transformedFixture.geometryType = 'esriGeometryTypeNone';
    result.should.deepEqual(transformedFixture);
  });
});

function createFixture() {
  return {
    objectIdFieldName: 'FID',
    uniqueIdField: {
      name: 'FID',
      isSystemMaintained: true,
    },
    globalIdFieldName: 'GlobalID_2',
    serverGens: {
      minServerGen: 3485630,
      serverGen: 3485630,
    },
    geometryType: 'esriGeometryPoint',
    spatialReference: {
      wkid: 102100,
      latestWkid: 3857,
    },
    fields: [
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
    ],
    exceededTransferLimit: true,
    features: [
      {
        attributes: {
          FID: 1,
          OBJECTID: 46104019,
          WARD: 6,
          FACILITYID: '30040-085-3001-0126-000',
          TBOX_L: 99,
          CONDITIODT: 1421798400000,
          GlobalID_2: '9279699f-5ece-4ca6-8a3b-b559da37bc5e',
        },
        geometry: {
          x: -8571657.3541762847,
          y: 4704411.394312229,
        },
      },
    ],
  };
}
