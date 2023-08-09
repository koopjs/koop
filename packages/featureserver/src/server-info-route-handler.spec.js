const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('server info', () => {
  const sandbox = sinon.createSandbox();
  const serverMetadataCreateSpy = sandbox.spy(() => {
    return {
      server: 'metadata',
    };
  });
  const serverInfoHandler = proxyquire('./server-info-route-handler', {
    './helpers/server-metadata': {
      create: serverMetadataCreateSpy,
    },
  });

  beforeEach(() => {
    sandbox.resetHistory();
  });

  it('should construct options from empty geojson and no settings', () => {
    const serverInfo = serverInfoHandler({});

    serverInfo.should.deepEqual({ server: 'metadata' });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        initialExtent: undefined,
        fullExtent: undefined,
        layers: [],
        tables: [],
        relationships: [],
      },
    ]);
  });


  it('should construct options from empty geojson and app config', () => {
    const serverInfo = serverInfoHandler({}, { app: { locals: { config: { featureServer: { currentVersion: 101.1 } } } }});

    serverInfo.should.deepEqual({ server: 'metadata' });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: 101.1,
        fullVersion: undefined,
        initialExtent: undefined,
        fullExtent: undefined,
        layers: [],
        tables: [],
        relationships: [],
      },
    ]);
  });

  it('should construct options from geojson metadata, server-config settings, and app config', () => {

    const serverInfoHandler = proxyquire('./server-info-route-handler', {
      './helpers/server-metadata': {
        create: serverMetadataCreateSpy,
      },
      './server-config-options': {
        get: () => {
          return {
            currentVersion: 99.1,
            description: 'From server config',
            serviceDescription: 'From server config'
          };
        }
      }
    });
    const serverInfo = serverInfoHandler({
      metadata: {
        description: 'From provider meta'
      }
    }, { app: { locals: { config: { featureServer: { currentVersion: 101.1, serviceDescription: 'From app config' } } } }});

    serverInfo.should.deepEqual({ server: 'metadata' });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: 99.1,
        fullVersion: undefined,
        description: 'From provider meta',
        serviceDescription: 'From server config',
        initialExtent: undefined,
        fullExtent: undefined,
        layers: [],
        tables: [],
        relationships: [],
      },
    ]);
  });

  it('should construct options from empty feature collection and no settings', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [] };
    const serverInfo = serverInfoHandler(simpleCollectionFixture);

    serverInfo.should.deepEqual({ server: 'metadata' });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        initialExtent: undefined,
        fullExtent: undefined,
        layers: [],
        tables: [
          {
            id: 0,
            name: 'Table_0',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
          },
        ],
        relationships: [],
      },
    ]);
  });

  it('should construct options from feature collection with no geometry and no settings', () => {
    const simpleCollectionFixture = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: {}, geometry: null },
        { type: 'Feature', properties: {}, geometry: null },
        { type: 'Feature', properties: {}, geometry: null },
      ],
    };

    const serverInfo = serverInfoHandler(simpleCollectionFixture);

    serverInfo.should.deepEqual({
      server: 'metadata',
    });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        initialExtent: undefined,
        fullExtent: undefined,
        layers: [],
        tables: [
          {
            id: 0,
            name: 'Table_0',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
          },
        ],
        relationships: [],
      },
    ]);
  });

  it('should construct options from feature collection with CRS and features, no settings', () => {
    const simpleCollectionFixture = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-100, 40] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-101, 41] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-99, 39] },
        },
      ],
    };

    const serverInfo = serverInfoHandler(simpleCollectionFixture);

    serverInfo.should.deepEqual({
      server: 'metadata',
    });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        fullExtent: {
          spatialReference: { wkid: 4326, latestWkid: 4326 },
          xmin: -101,
          xmax: -99,
          ymin: 39,
          ymax: 41,
        },
        initialExtent: {
          spatialReference: { wkid: 4326, latestWkid: 4326 },
          xmin: -101,
          xmax: -99,
          ymin: 39,
          ymax: 41,
        },
        layers: [
          {
            id: 0,
            name: 'Layer_0',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
            geometryType: 'esriGeometryPoint',
          },
        ],
        tables: [],
        relationships: [],
      },
    ]);
  });

  it('should construct options using metadata where defined, no settings', () => {
    const layer1 = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-100, 40] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-101, 41] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-99, 39] },
        },
      ],
    };
    const layer2 = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-122, 49] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-121, 20] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-110, 43] },
        },
      ],
    };
    const tables = [
      {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: [
          { type: 'Feature', properties: {}, geometry: null },
          { type: 'Feature', properties: {}, geometry: null },
          { type: 'Feature', properties: {}, geometry: null },
        ],
      },
    ];
    const input = {
      maxRecordCount: 5000,
      hasStaticData: true,
      serviceDescription: 'A service description from provider metadata',
      description: 'Defined in provider metadata',
      copyrightText: 'Custom Copyright Text',
      name: 'Foobar',
      extent: [-110, -90, 180, 90],
      initialExtent: [-110, -80, 180, 90],
      geometryType: 'set by metadata',
      layers: [layer1, layer2],
      tables,
    };

    const serverInfo = serverInfoHandler(input);

    serverInfo.should.deepEqual({
      server: 'metadata',
    });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        maxRecordCount: 5000,
        hasStaticData: true,
        serviceDescription: 'A service description from provider metadata',
        description: 'Defined in provider metadata',
        copyrightText: 'Custom Copyright Text',
        name: 'Foobar',
        extent: [-110, -90, 180, 90],
        initialExtent: {
          xmin: -110,
          ymin: -80,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        geometryType: 'set by metadata',
        layers: [
          {
            id: 0,
            name: 'Layer_0',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
            geometryType: 'esriGeometryPoint',
          },
          {
            id: 1,
            name: 'Layer_1',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
            geometryType: 'esriGeometryPoint',
          },
        ],
        tables: [
          {
            id: 2,
            name: 'Table_2',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
          },
        ],
        fullExtent: {
          xmin: -110,
          ymin: -90,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        relationships: [],
      },
    ]);
  });

  it('should construct options with relationships', () => {
    const layer1 = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-100, 40] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-101, 41] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-99, 39] },
        },
      ],
    };
    const layer2 = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-122, 49] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-121, 20] },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: [-110, 43] },
        },
      ],
    };
    const tables = [
      {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: [
          { type: 'Feature', properties: {}, geometry: null },
          { type: 'Feature', properties: {}, geometry: null },
          { type: 'Feature', properties: {}, geometry: null },
        ],
      },
    ];
    const relationships = [
      { id: 0, name: 'Relationship_0' },
      { id: 1 },
    ];
    const input = {
      maxRecordCount: 5000,
      hasStaticData: true,
      serviceDescription: 'A service description from provider metadata',
      description: 'Defined in provider metadata',
      copyrightText: 'Custom Copyright Text',
      name: 'Foobar',
      extent: [-110, -90, 180, 90],
      initialExtent: [-110, -80, 180, 90],
      geometryType: 'set by metadata',
      layers: [layer1, layer2],
      tables,
      relationships,
    };

    const serverInfo = serverInfoHandler(input);

    serverInfo.should.deepEqual({
      server: 'metadata',
    });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        maxRecordCount: 5000,
        hasStaticData: true,
        serviceDescription: 'A service description from provider metadata',
        description: 'Defined in provider metadata',
        copyrightText: 'Custom Copyright Text',
        name: 'Foobar',
        extent: [-110, -90, 180, 90],
        initialExtent: {
          xmin: -110,
          ymin: -80,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        geometryType: 'set by metadata',
        layers: [
          {
            id: 0,
            name: 'Layer_0',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
            geometryType: 'esriGeometryPoint',
          },
          {
            id: 1,
            name: 'Layer_1',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
            geometryType: 'esriGeometryPoint',
          },
        ],
        tables: [
          {
            id: 2,
            name: 'Table_2',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
          },
        ],
        fullExtent: {
          xmin: -110,
          ymin: -90,
          xmax: 180,
          ymax: 90,
          spatialReference: { wkid: 4326, latestWkid: 4326 },
        },
        relationships: [
          {
            id: 0,
            name: 'Relationship_0',
          },
          {
            id: 1,
            name: 'Relationship_1',
          },
        ],
      },
    ]);
  });

  it('should fail to construct extents from layers, log error', () => {
    const simpleCollectionFixture = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: ['test', 40] },
        },
      ],
    };

    const serverInfo = serverInfoHandler(simpleCollectionFixture);

    serverInfo.should.deepEqual({
      server: 'metadata',
    });

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullVersion: undefined,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        fullExtent: undefined,
        initialExtent: undefined,
        layers: [
          {
            id: 0,
            name: 'Layer_0',
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 0,
            maxScale: 0,
            geometryType: 'esriGeometryPoint',
          },
        ],
        tables: [],
        relationships: [],
      },
    ]);
  });
});
