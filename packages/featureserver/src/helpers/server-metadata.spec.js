const should = require('should');
should.config.checkProtoEql = false;
const proxyquire = require('proxyquire');
const ServerMetadata = require('./server-metadata');

describe('ServerMetadata', () => {
  it('should use defaults when no overrides', () => {
    const result = ServerMetadata.create();

    console.log(JSON.stringify(result));

    result.should.deepEqual({
      currentVersion: 11.1,
      serviceDescription:
        'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
      hasVersionedData: false,
      supportsDisconnectedEditing: false,
      hasStaticData: false,
      hasSharedDomains: false,
      maxRecordCount: 2000,
      supportedQueryFormats: 'JSON',
      supportsVCSProjection: false,
      supportedExportFormats: '',
      capabilities: 'Query',
      description:
        'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
      copyrightText:
        'Copyright information varies by provider. For more information please contact the source of this data.',
      spatialReference: { wkid: 4326, latestWkid: 4326 },
      fullExtent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      initialExtent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      allowGeometryUpdates: false,
      units: 'esriDecimalDegrees',
      supportsAppend: false,
      supportsSharedDomains: false,
      supportsWebHooks: false,
      supportsTemporalLayers: false,
      layerOverridesEnabled: false,
      syncEnabled: false,
      supportsApplyEditsWithGlobalIds: false,
      supportsReturnDeleteResults: false,
      supportsLayerOverrides: false,
      supportsTilesAndBasicQueriesMode: true,
      supportsQueryContingentValues: false,
      supportedContingentValuesFormats: '',
      supportsContingentValuesJson: null,
      tables: [],
      layers: [],
      supportsRelationshipsResource: false,
    });
  });

  it('should merge overrides and defaults', () => {
    const result = ServerMetadata.create({
      copyrightText: 'override default',
      description: 'hello world',
      serviceDescription: 'goodbye',
      initialExtent: {
        xmin: -160,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
    });

    result.should.deepEqual({
      currentVersion: 11.1,
      serviceDescription: 'goodbye',
      hasVersionedData: false,
      supportsDisconnectedEditing: false,
      hasStaticData: false,
      hasSharedDomains: false,
      maxRecordCount: 2000,
      supportedQueryFormats: 'JSON',
      supportsVCSProjection: false,
      supportedExportFormats: '',
      capabilities: 'Query',
      description: 'hello world',
      copyrightText: 'override default',
      spatialReference: { wkid: 4326, latestWkid: 4326 },
      fullExtent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      initialExtent: {
        xmin: -160,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      allowGeometryUpdates: false,
      units: 'esriDecimalDegrees',
      supportsAppend: false,
      supportsSharedDomains: false,
      supportsWebHooks: false,
      supportsTemporalLayers: false,
      layerOverridesEnabled: false,
      syncEnabled: false,
      supportsApplyEditsWithGlobalIds: false,
      supportsReturnDeleteResults: false,
      supportsLayerOverrides: false,
      supportsTilesAndBasicQueriesMode: true,
      supportsQueryContingentValues: false,
      supportedContingentValuesFormats: '',
      supportsContingentValuesJson: null,
      tables: [],
      layers: [],
      supportsRelationshipsResource: false,
    });
  });

  it('should skip undefined overrides', () => {
    const result = ServerMetadata.create({
      copyrightText: undefined,
    });

    result.should.deepEqual({
      currentVersion: 11.1,
      serviceDescription:
        'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
      hasVersionedData: false,
      supportsDisconnectedEditing: false,
      hasStaticData: false,
      hasSharedDomains: false,
      maxRecordCount: 2000,
      supportedQueryFormats: 'JSON',
      supportsVCSProjection: false,
      supportedExportFormats: '',
      capabilities: 'Query',
      description:
        'This is a feature service exposed with Koop. For more information go to https://github.com/koopjs/koop.',
      copyrightText:
        'Copyright information varies by provider. For more information please contact the source of this data.',
      spatialReference: { wkid: 4326, latestWkid: 4326 },
      fullExtent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      initialExtent: {
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
      allowGeometryUpdates: false,
      units: 'esriDecimalDegrees',
      supportsAppend: false,
      supportsSharedDomains: false,
      supportsWebHooks: false,
      supportsTemporalLayers: false,
      layerOverridesEnabled: false,
      syncEnabled: false,
      supportsApplyEditsWithGlobalIds: false,
      supportsReturnDeleteResults: false,
      supportsLayerOverrides: false,
      supportsTilesAndBasicQueriesMode: true,
      supportsQueryContingentValues: false,
      supportedContingentValuesFormats: '',
      supportsContingentValuesJson: null,
      tables: [],
      layers: [],
      supportsRelationshipsResource: false,
    });
  });

  it('should use description for service description when passed as override', () => {
    const result = ServerMetadata.create({
      description: 'set description',
    });

    result.serviceDescription.should.equal('set description');
    result.description.should.equal('set description');
  });

  it('should use fullExtent for initialExtent when passed as override', () => {
    const result = ServerMetadata.create({
      fullExtent: {
        xmin: -100,
        ymin: -20,
        xmax: 100,
        ymax: 20,
        spatialReference: { wkid: 4326, latestWkid: 4326 },
      },
    });
    result.initialExtent.should.deepEqual({
      xmin: -100,
      ymin: -20,
      xmax: 100,
      ymax: 20,
      spatialReference: { wkid: 4326, latestWkid: 4326 },
    });
    result.fullExtent.should.deepEqual({
      xmin: -100,
      ymin: -20,
      xmax: 100,
      ymax: 20,
      spatialReference: { wkid: 4326, latestWkid: 4326 },
    });
  });

  describe('set units', () => {
    it('should use spatial reference units', () => {
      const result = ServerMetadata.create({
        spatialReference: { wkid: 3857 },
      });

      result.units.should.equal('esriMeters');
    });

    it('should use default units if unable extract', () => {
      const ServerMetadata = proxyquire('./server-metadata', {
        './esri-units-lookup': () => {
          throw new Error();
        },
      });

      const result = ServerMetadata.create({
        spatialReference: { wkid: 3857 },
      });

      result.units.should.equal('esriDecimalDegrees');
    });

    it('should use wkt if available', () => {
      const result = ServerMetadata.create({
        spatialReference: {
          wkt: 'PROJCS["WGS 84 / Pseudo-Mercator",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Mercator_1SP"],PARAMETER["central_meridian",0],PARAMETER["scale_factor",1],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs"],AUTHORITY["EPSG","3857"]]',
        },
      });

      result.units.should.equal('esriMeters');
    });
  });
});
