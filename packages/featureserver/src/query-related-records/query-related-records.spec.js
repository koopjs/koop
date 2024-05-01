require('should');
const { queryRelatedRecords } = require('./query-related-records');
const relatedData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: "Milwaukee's Best Light",
            OBJECTID: 265183,
          },
          geometry: null,
        },
      ],
      properties: {
        objectid: 261193,
      },
    },
  ],
  metadata: {
    idField: 'OBJECTID',
    fields: [
      {
        name: 'OBJECTID',
        alias: 'objectid',
        type: 'OID',
      },
      {
        name: 'name',
        type: 'String',
      },
    ],
  },
};

const relatedDataWithGeom = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: "Milwaukee's Best Light",
            OBJECTID: 265183,
          },
          geometry: [-104.9476, 39.9448],
        },
      ],
      properties: {
        objectid: 261193,
      },
    },
  ],
  metadata: {
    idField: 'OBJECTID',
    fields: [
      {
        name: 'OBJECTID',
        alias: 'objectid',
        type: 'OID',
      },
      {
        name: 'name',
        type: 'String',
      },
    ],
  },
};
const relatedDataCount = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'FeatureCollection',
      features: [],
      properties: {
        objectid: 261193,
        count: 11,
      },
    },
  ],
};

describe('QueryRelatedRecords operation', () => {
  it('should return the expected response schema for an optionless query', () => {
    const response = queryRelatedRecords(relatedData, {});
    response.should.have.property('fields');
    response.should.have.property('relatedRecordGroups');
    response.fields.should.have.length(2);
    response.relatedRecordGroups.should.have.length(1);
    response.relatedRecordGroups[0].should.have.property('objectId', 261193);
    response.relatedRecordGroups[0].should.have.property('relatedRecords');
    response.relatedRecordGroups[0].relatedRecords.should.have.length(1);
  });

  it('should return the expected response schema when data has geometry', () => {
    const response = queryRelatedRecords(relatedDataWithGeom, {});
    response.should.have.property('fields');
    response.should.have.property('relatedRecordGroups');
    response.fields.should.have.length(2);
    response.relatedRecordGroups.should.have.length(1);
    response.relatedRecordGroups[0].should.have.property('objectId', 261193);
    response.relatedRecordGroups[0].should.have.property('relatedRecords');
    response.relatedRecordGroups[0].relatedRecords.should.have.length(1);
    response.relatedRecordGroups[0].relatedRecords.should.deepEqual([
      {
        attributes: {
          OBJECTID: 265183,
          name: "Milwaukee's Best Light",
        },
        geometry: [-104.9476, 39.9448],
      },
    ]);
  });

  it('should return the expected response schema when data has no features', () => {
    const response = queryRelatedRecords({}, {});
    response.should.have.property('fields');
    response.should.have.property('relatedRecordGroups');
    response.fields.should.have.length(1);
    response.relatedRecordGroups.should.have.length(0);
  });

  it('should return count of features when returnCountOnly true in options', () => {
    const response = queryRelatedRecords(relatedData, {
      returnCountOnly: true,
    });
    response.should.not.have.property('fields');
    response.should.have.property('relatedRecordGroups');
    response.relatedRecordGroups.should.have.length(1);
    response.relatedRecordGroups[0].should.have.property('objectId', 261193);
    response.relatedRecordGroups[0].should.not.have.property('relatedRecords');
    response.relatedRecordGroups[0].should.have.property('count', 1);
  });

  it('should return count when specified in properties and returnCountOnly true in options', () => {
    const response = queryRelatedRecords(relatedDataCount, {
      returnCountOnly: true,
    });
    response.should.not.have.property('fields');
    response.should.have.property('relatedRecordGroups');
    response.relatedRecordGroups.should.have.length(1);
    response.relatedRecordGroups[0].should.have.property('objectId', 261193);
    response.relatedRecordGroups[0].should.not.have.property('relatedRecords');
    response.relatedRecordGroups[0].should.have.property('count', 11);
  });
});
