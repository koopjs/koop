const FeatureServer = require('../..');
const data = require('./fixtures/snow.json');
const should = require('should');
should.config.checkProtoEql = false;
const _ = require('lodash');

describe('Layers operations', () => {
  describe('layers info', () => {
    it('should conform to the prescribed schema', () => {
      const result = FeatureServer.layersInfo(data);
      result.should.deepEqual({
        layers: [
          {
            currentVersion: 11.1,
            id: 0,
            name: 'Snow',
            type: 'Feature Layer',
            displayField: '',
            description: 'MyTestDesc',
            copyrightText:
              'Copyright information varies by provider. For more information please contact the source of this data.',
            defaultVisibility: true,
            isDataVersioned: false,
            hasContingentValuesDefinition: false,
            supportsAppend: false,
            supportsCalculate: false,
            supportsASyncCalculate: false,
            supportsTruncate: false,
            supportsAttachmentsByUploadId: false,
            supportsAttachmentsResizing: false,
            supportsRollbackOnFailureParameter: false,
            supportsStatistics: true,
            supportsExceedsLimitStatistics: false,
            supportsAdvancedQueries: true,
            supportsValidateSql: false,
            supportsLayerOverrides: false,
            supportsTilesAndBasicQueriesMode: true,
            supportsFieldDescriptionProperty: false,
            supportsQuantizationEditMode: false,
            supportsApplyEditsWithGlobalIds: false,
            supportsReturningQueryGeometry: false,
            advancedQueryCapabilities: {
              supportsPagination: true,
              supportsQueryAttachmentsCountOnly: false,
              supportsPaginationOnAggregatedQueries: false,
              supportsQueryRelatedPagination: false,
              supportsQueryWithDistance: false,
              supportsReturningQueryExtent: true,
              supportsStatistics: true,
              supportsOrderBy: true,
              supportsDistinct: true,
              supportsQueryWithResultType: false,
              supportsSqlExpression: false,
              supportsAdvancedQueryRelated: false,
              supportsCountDistinct: false,
              supportsPercentileStatistics: false,
              supportedSpatialAggregationStatistics: [],
              supportsLod: false,
              supportsQueryWithLodSR: false,
              supportedLodTypes: [],
              supportsReturningGeometryCentroid: false,
              supportsReturningGeometryEnvelope: false,
              supportsQueryWithDatumTransformation: false,
              supportsCurrentUserQueries: false,
              supportsHavingClause: false,
              supportsOutFieldSQLExpression: false,
              supportsMaxRecordCountFactor: false,
              supportsTopFeaturesQuery: false,
              supportsDisjointSpatialRel: false,
              supportsQueryWithCacheHint: false,
              supportedOperationsWithCacheHint: [],
              supportsQueryAnalytic: false,
              supportsDefaultSR: false,
              supportsFullTextSearch: false,
              advancedQueryAnalyticCapabilities: {},
              advancedEditingCapabilities: {},
            },
            useStandardizedQueries: true,
            allowGeometryUpdates: false,
            hasAttachments: false,
            htmlPopupType: 'esriServerHTMLPopupTypeNone',
            hasM: false,
            hasZ: false,
            objectIdField: 'OBJECTID',
            uniqueIdField: {
              name: 'OBJECTID',
              isSystemMaintained: true,
            },
            globalIdField: '',
            typeIdField: '',
            dateFieldsTimeReference: {
              timeZone: 'UTC',
              respectsDaylightSaving: false,
            },
            preferredTimeReference: null,
            templates: [],
            supportedQueryFormats: 'JSON,geojson,PBF',
            supportedAppendFormats: '',
            supportedExportFormats: '',
            supportedSpatialRelationships: [
              'esriSpatialRelIntersects',
              'esriSpatialRelContains',
              'esriSpatialRelEnvelopeIntersects',
              'esriSpatialRelWithin',
            ],
            supportedContingentValuesFormats: '',
            hasStaticData: false,
            maxRecordCount: 2000,
            standardMaxRecordCount: 2000,
            standardMaxRecordCountNoGeometry: 2000,
            tileMaxRecordCount: 2000,
            maxRecordCountFactor: 1,
            fields: [
              {
                name: 'OBJECTID',
                type: 'esriFieldTypeOID',
                alias: 'OBJECTID',
                sqlType: 'sqlTypeInteger',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
              {
                name: 'station name',
                type: 'esriFieldTypeString',
                alias: 'station name',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                length: 128,
                editable: false,
                nullable: false,
              },
              {
                name: 'latitude',
                type: 'esriFieldTypeDouble',
                alias: 'latitude',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
              {
                name: 'daily precip',
                type: 'esriFieldTypeDouble',
                alias: 'daily precip',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
              {
                name: 'total precip',
                type: 'esriFieldTypeDouble',
                alias: 'total precip',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
              {
                name: 'daily snow total',
                type: 'esriFieldTypeDouble',
                alias: 'daily snow total',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
              {
                name: 'longitude',
                type: 'esriFieldTypeDouble',
                alias: 'longitude',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
              {
                name: 'station',
                type: 'esriFieldTypeString',
                alias: 'station',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                length: 128,
                editable: false,
                nullable: false,
              },
              {
                name: 'multi-day precip',
                type: 'esriFieldTypeString',
                alias: 'multi-day precip',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                length: 128,
                editable: false,
                nullable: false,
              },
              {
                name: 'num of reports',
                type: 'esriFieldTypeInteger',
                alias: 'num of reports',
                sqlType: 'sqlTypeOther',
                domain: null,
                defaultValue: null,
                editable: false,
                nullable: false,
              },
            ],
            relationships: [],
            capabilities: 'Query',
            ownershipBasedAccessControlForFeatures: {
              allowOthersToQuery: true,
            },
            types: [],
            timeInfo: {},
            minScale: 0,
            maxScale: 0,
            drawingInfo: {
              renderer: {
                type: 'simple',
                symbol: {
                  color: [45, 172, 128, 161],
                  outline: {
                    color: [190, 190, 190, 105],
                    width: 0.5,
                    type: 'esriSLS',
                    style: 'esriSLSSolid',
                  },
                  size: 7.5,
                  type: 'esriSMS',
                  style: 'esriSMSCircle',
                },
              },
              labelingInfo: null,
            },
            extent: {
              xmin: -108.9395,
              xmax: -102,
              ymin: 37.084968,
              ymax: 40.8877,
              spatialReference: {
                wkid: 4326,
                latestWkid: 4326,
              },
            },
            supportsCoordinatesQuantization: false,
            hasLabels: false,
            geometryType: 'esriGeometryPoint',
          },
        ],
        tables: [],
      });
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
        capabilities: 'list,of,stuff',
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
