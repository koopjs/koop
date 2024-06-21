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
  const req = {
    app: {
      locals: {},
    },
    body: {},
    query: {},
  };

  const res = {};
  const handlerSpy = sinon.spy();
  const loggerSpy = {
    warn: sinon.spy(),
    debug: sinon.spy(),
  };

  const serverInfoHandler = proxyquire('./server-info-route-handler', {
    './helpers/server-metadata': {
      create: serverMetadataCreateSpy,
    },
    './response-handlers': {
      generalResponseHandler: handlerSpy,
    },
    './log-manager': { logger: loggerSpy },
  });

  beforeEach(() => {
    sandbox.resetHistory();
  });

  it('should construct options from empty geojson and no settings', () => {
    serverInfoHandler(req, res, {});

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        capabilities: 'Query',
        currentVersion: undefined,
        fullExtent: undefined,
        initialExtent: undefined,
        spatialReference: {
          latestWkid: 4326,
          wkid: 4326,
        },
        layers: [],
        tables: [],
        relationships: [],
      },
    ]);

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
    ]);
  });

  it('should construct options from empty geojson and app config', () => {
    const req = {
      app: {
        locals: { config: { featureServer: { currentVersion: 101.1 } } },
      },
      query: {},
      body: {},
    };

    serverInfoHandler(req, res, {});

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        capabilities: 'Query',
        currentVersion: 101.1,
        fullExtent: undefined,
        initialExtent: undefined,
        spatialReference: {
          latestWkid: 4326,
          wkid: 4326,
        },
        layers: [],
        tables: [],
        relationships: [],
      },
    ]);

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
    ]);
  });

  it('should construct options from empty feature collection and no settings', () => {
    const simpleCollectionFixture = { type: 'FeatureCollection', features: [] };
    serverInfoHandler(req, res, simpleCollectionFixture);

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        capabilities: 'Query',
        fullExtent: undefined,
        initialExtent: undefined,
        spatialReference: {
          latestWkid: 4326,
          wkid: 4326,
        },
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
            type: 'Table',
          },
        ],
        relationships: [],
      },
    ]);

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
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

    serverInfoHandler(req, res, simpleCollectionFixture);

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        fullExtent: undefined,
        initialExtent: undefined,
        capabilities: 'Query',
        spatialReference: {
          latestWkid: 4326,
          wkid: 4326,
        },
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
            type: 'Table',
          },
        ],
        relationships: [],
      },
    ]);

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
    ]);
  });

  it('should construct options from collection with CRS and features, no settings', () => {
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

    serverInfoHandler(req, res, simpleCollectionFixture);

    serverMetadataCreateSpy.firstCall.args.should.deepEqual([
      {
        currentVersion: undefined,
        capabilities: 'Query',
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
        spatialReference: {
          latestWkid: 4326,
          wkid: 4326,
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
            type: 'Feature Layer',
          },
        ],
        tables: [],
        relationships: [],
      },
    ]);

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
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

    serverInfoHandler(req, res, input);

    serverMetadataCreateSpy.firstCall.args[0].maxRecordCount.should.equal(5000);
    serverMetadataCreateSpy.firstCall.args[0].name.should.equal('Foobar');
    serverMetadataCreateSpy.firstCall.args[0].geometryType.should.equal('set by metadata');
    serverMetadataCreateSpy.firstCall.args[0].initialExtent.should.deepEqual({
      xmin: -110,
      ymin: -80,
      xmax: 180,
      ymax: 90,
      spatialReference: { latestWkid: 4326, wkid: 4326 },
    });
    serverMetadataCreateSpy.firstCall.args[0].fullExtent.should.deepEqual({
      xmin: -110,
      ymin: -90,
      xmax: 180,
      ymax: 90,
      spatialReference: { latestWkid: 4326, wkid: 4326 },
    });
    serverMetadataCreateSpy.firstCall.args[0].serviceDescription.should.equal(
      'A service description from provider metadata',
    );
    serverMetadataCreateSpy.firstCall.args[0].description.should.equal(
      'Defined in provider metadata',
    );
    serverMetadataCreateSpy.firstCall.args[0].copyrightText.should.equal('Custom Copyright Text');

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
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
    const relationships = [{ id: 0, name: 'Relationship_0' }, { id: 1 }];
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

    serverInfoHandler(req, res, input);

    serverMetadataCreateSpy.firstCall.args[0].relationships.should.deepEqual([
      {
        id: 0,
        name: 'Relationship_0',
      },
      {
        id: 1,
        name: 'Relationship_1',
      },
    ]);

    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
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
          geometry: { type: 'Point', coordinates: ['test', undefined] },
        },
      ],
    };

    serverInfoHandler(req, res, simpleCollectionFixture);

    should(serverMetadataCreateSpy.firstCall.args[0].fullExtent).equal(undefined);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
    ]);
  });

  it('should ignore malformed metadata extent', () => {
    const simpleCollectionFixture = {
      type: 'FeatureCollection',
      metadata: { extent: [0, 'a', 3] },
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: ['test', 40] },
        },
      ],
    };

    serverInfoHandler(req, res, simpleCollectionFixture);

    should(serverMetadataCreateSpy.firstCall.args[0].fullExtent).equal(undefined);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        server: 'metadata',
      },
      {},
    ]);
  });
});
