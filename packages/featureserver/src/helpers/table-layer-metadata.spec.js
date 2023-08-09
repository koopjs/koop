const should = require('should');
should.config.checkProtoEql = false;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { CURRENT_VERSION, FULL_VERSION } = require('../constants');

const createLayerMetadataFieldsSpy = sinon.spy(function () {
  return ['fields'];
});
const fields = {
  LayerFields: {
    create: createLayerMetadataFieldsSpy
  }
};

const TableLayerMetadata = proxyquire('./table-layer-metadata', {
  '../helpers/fields': fields
});

const defaultFixture = {
  id: 0,
  name: 'Not Set',
  type: 'Table',
  description: 'This is a feature service powered by https://github.com/koopjs/koop/tree/master/packages/featureserver#readme',
  copyrightText: ' ',
  parentLayer: null,
  subLayers: null,
  defaultVisibility: true,
  hasAttachments: false,
  htmlPopupType: 'esriServerHTMLPopupTypeNone',
  displayField: 'OBJECTID',
  typeIdField: null,
  fields: [],
  relationships: [],
  capabilities: 'Query',
  maxRecordCount: 2000,
  supportsStatistics: true,
  supportsAdvancedQueries: true,
  supportedQueryFormats: 'JSON',
  ownershipBasedAccessControlForFeatures: {
    allowOthersToQuery: true
  },
  useStandardizedQueries: true,
  advancedQueryCapabilities: {
    useStandardizedQueries: true,
    supportsStatistics: true,
    supportsOrderBy: true,
    supportsDistinct: true,
    supportsPagination: true,
    supportsTrueCurve: false,
    supportsReturningQueryExtent: true,
    supportsQueryWithDistance: true
  },
  canModifyLayer: false,
  dateFieldsTimeReference: null,
  isDataVersioned: false,
  supportsRollbackOnFailureParameter: true,
  hasM: false,
  hasZ: false,
  allowGeometryUpdates: true,
  objectIdField: 'OBJECTID',
  globalIdField: '',
  types: [],
  templates: [],
  hasStaticData: false,
  timeInfo: {},
  uniqueIdField: {
    name: 'OBJECTID',
    isSystemMaintained: true
  },
  currentVersion: CURRENT_VERSION,
  fullVersion: FULL_VERSION
};

describe('TableLayerMetadata', () => {
  beforeEach(() => {
    createLayerMetadataFieldsSpy.resetHistory();
  });

  it('calling with new should return default metadata', () => {
    const tableLayerMetadata = new TableLayerMetadata();
    tableLayerMetadata.should.deepEqual(defaultFixture);
  });

  describe('mixinOverrides', () => {
    it('uses fields creator helper', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      const geojson = {
        features: [{
          type: 'FeatureCollection',
          properties: {}
        }]
      };
      tableLayerMetadata.mixinOverrides(geojson);

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields']
      });
      createLayerMetadataFieldsSpy.callCount.should.equal(1);
      createLayerMetadataFieldsSpy.firstCall.args.should.deepEqual([geojson]);
    });

    it('defers to "layerId" option for "id"', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { layerId: '2' });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        id: 2
      });
    });

    it('uses "id" option when no "layerId" option', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { id: 3 });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        id: 3
      });
    });

    it('defers to "displayField" option for "displayField"', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { displayField: 'hellow' });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        displayField: 'hellow'
      });
    });

    it('"idField" option used in multiple overrides', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { idField: 'fluffy' });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        objectIdField: 'fluffy',
        displayField: 'fluffy',
        uniqueIdField: {
          isSystemMaintained: true,
          name: 'fluffy'
        }
      });
    });

    it('"hasZ" option used when present in metadata', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { hasZ: true });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasZ: true
      });
    });

    it('"hasStaticData" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { hasStaticData: true });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasStaticData: true
      });
    });

    it('"hasStaticData" option ignored if not a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { hasStaticData: 'true' });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasStaticData: false
      });
    });

    it('empty "capabilities" option ignored', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { capabilities: {} });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields']
      });
    });

    it('defer to "capabilities.list" option if defined ', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { capabilities: { list: 'hello,world' } });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        capabilities: 'hello,world'
      });
    });

    it('add "Extract" to default "capabilities" if capabilities.extract is truthy', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { capabilities: { extract: true } });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        capabilities: 'Query,Extract'
      });
    });

    it('"hasStaticData" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { hasStaticData: true });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasStaticData: true
      });
    });

    it('"supportsPagination" option ignored if not a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { supportsPagination: 'false' });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields']
      });
    });

    it('"supportsPagination" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { supportsPagination: false });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        advancedQueryCapabilities: {
          ...defaultFixture.advancedQueryCapabilities,
          supportsPagination: false
        }
      });
    });

    it('"hasAttachments" option used if a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { hasAttachments: true });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasAttachments: true
      });
    });

    it('"hasAttachments" option ignored if not a boolean value', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, { hasAttachments: 'true' });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        hasAttachments: false
      });
    });

    it('use supported options for direct overrides', () => {
      const tableLayerMetadata = new TableLayerMetadata();
      tableLayerMetadata.mixinOverrides({}, {
        name: 'Hank Williams',
        relationships: ['something'],
        description: 'There is a tear in my beer.',
        copyrightText: 'copyright-text',
        templates: ['templates'],
        timeInfo: { time: 'June of 44' },
        maxRecordCount: 9999,
        defaultVisibility: false,
        currentVersion: 90.99,
        fullVersion: '90.9.9'
      });

      tableLayerMetadata.should.deepEqual({
        ...defaultFixture,
        fields: ['fields'],
        name: 'Hank Williams',
        relationships: ['something'],
        description: 'There is a tear in my beer.',
        copyrightText: 'copyright-text',
        templates: ['templates'],
        timeInfo: { time: 'June of 44' },
        maxRecordCount: 9999,
        defaultVisibility: false,
        currentVersion: 90.99,
        fullVersion: '90.9.9'
      });
    });
  });

  it('static method "normalizeInput" should create expected geojson and default options', () => {
    const { geojson, options } = TableLayerMetadata.normalizeInput({
      features: ['feature']
    }, {
      params: { layer: '99' }
    });
    geojson.should.deepEqual({ features: ['feature'] });
    options.should.deepEqual({
      capabilities: {},
      layerId: '99'
    });
  });

  it('static method "normalizeInput" should merge capabilities', () => {
    const { geojson, options } = TableLayerMetadata.normalizeInput({
      features: ['feature'],
      metadata: {
        capabilities: 'list,of,stuff'
      },
      capabilities: {
        world: 'hellow'
      }
    }, {
      params: { layer: '99' }
    });
    geojson.should.deepEqual({ features: ['feature'] });
    options.should.deepEqual({
      layerId: '99',
      capabilities: {
        list: 'list,of,stuff',
        world: 'hellow'
      }
    });
  });

  it('static method "normalizeInput" should defer to metadata description', () => {
    const { geojson, options } = TableLayerMetadata.normalizeInput({
      features: ['feature'],
      metadata: {
        description: 'Metadata description'
      }
    }, {
      params: { layer: '99' },
      app: {
        locals: {
          config: {
            featureServer: {
              description: 'Overrides default layer description.'
            }
          }
        }
      }
    });
    geojson.should.deepEqual({ features: ['feature'] });
    options.should.deepEqual({
      layerId: '99',
      description: 'Metadata description',
      capabilities: {}
    });
  });

  it('static method "create" should normalize input, call constructor, and mixin-overrides ', () => {
    const tableLayerMetadata = TableLayerMetadata.create({
      features: ['feature'],
      metadata: {
        foo: 'bar',
        displayField: 'myField',
        capabilities: 'list,of,stuff'
      },
      capabilities: {
        world: 'hellow'
      }
    }, {
      params: { layer: '99' },
      app: {
        locals: {
          config: {
            featureServer: {
              currentVersion: 90.99,
              fullVersion: '90.9.9',
              description: 'Overrides default layer description.'
            }
          }
        }
      }
    });
    tableLayerMetadata.should.deepEqual({
      ...defaultFixture,
      capabilities: 'list,of,stuff',
      displayField: 'myField',
      fields: ['fields'],
      id: 99,
      currentVersion: 90.99,
      fullVersion: '90.9.9',
      description: 'Overrides default layer description.'
    });
  });
});
