const should = require('should'); // eslint-disable-line
const { getGeometryTransform } = require('./get-geometry-transform');

describe('getGeometryTransform', () => {
  describe('from quantizationParameters', () => {
    it('from typical ArcGIS client quantizationParameters', () => {
      const quantizationParameters = {
        mode: 'view',
        originPosition: 'upperLeft',
        tolerance: 1.0583354500042335,
        extent: {
          type: 'extent',
          xmin: 18341377.47954369,
          ymin: 2979920.6113554947,
          xmax: 7546517.393554582,
          ymax: 11203512.89298139,
          spatialReference: { wkid: 102100, latestWkid: 3857 },
        },
      };
      const result = getGeometryTransform(
        { wkid: 4326 },
        quantizationParameters,
      );
      result.should.deepEqual({
        originPosition: 'upperLeft',
        scale: {
          xScale: 1.0583354500042335,
          yScale: 1.0583354500042335,
        },
        translate: {
          xTranslate: 18341377.47954369,
          yTranslate: 11203512.89298139,
        },
      });
    });

    it('upper-left origin', () => {
      const quantizationParameters = {
        mode: 'view',
        originPosition: 'upper-left',
        tolerance: 1.0583354500042335,
        extent: {
          type: 'extent',
          xmin: 18341377.47954369,
          ymin: 2979920.6113554947,
          xmax: 7546517.393554582,
          ymax: 11203512.89298139,
          spatialReference: { wkid: 102100, latestWkid: 3857 },
        },
      };
      const result = getGeometryTransform(
        { wkid: 4326 },
        quantizationParameters,
      );
      result.should.deepEqual({
        originPosition: 'upperLeft',
        scale: {
          xScale: 1.0583354500042335,
          yScale: 1.0583354500042335,
        },
        translate: {
          xTranslate: 18341377.47954369,
          yTranslate: 11203512.89298139,
        },
      });
    });

    it('lower-left origin', () => {
      const quantizationParameters = {
        mode: 'view',
        originPosition: 'lower-left',
        tolerance: 1.0583354500042335,
        extent: {
          type: 'extent',
          xmin: 18341377.47954369,
          ymin: 2979920.6113554947,
          xmax: 7546517.393554582,
          ymax: 11203512.89298139,
          spatialReference: { wkid: 102100, latestWkid: 3857 },
        },
      };
      const result = getGeometryTransform(
        { wkid: 4326 },
        quantizationParameters,
      );
      result.should.deepEqual({
        originPosition: 'lowerLeft',
        scale: {
          xScale: 1.0583354500042335,
          yScale: 1.0583354500042335,
        },
        translate: {
          xTranslate: 18341377.47954369,
          yTranslate: 11203512.89298139,
        },
      });
    });

    it('missing tolerance', () => {
      const quantizationParameters = {
        mode: 'view',
        originPosition: 'upperLeft',
        extent: {
          type: 'extent',
          xmin: 18341377.47954369,
          ymin: 2979920.6113554947,
          xmax: 7546517.393554582,
          ymax: 11203512.89298139,
          spatialReference: { wkid: 102100, latestWkid: 3857 },
        },
      };
      const result = getGeometryTransform(
        { wkid: 4326 },
        quantizationParameters,
      );
      result.should.deepEqual({
        originPosition: 'upperLeft',
        scale: {
          xScale: 1,
          yScale: 1,
        },
        translate: {
          xTranslate: 18341377.47954369,
          yTranslate: 11203512.89298139,
        },
      });
    });
    it('missing extent', () => {
      const quantizationParameters = {
        mode: 'view',
        originPosition: 'upperLeft',
        tolerance: 1.0583354500042335,
      };
      const result = getGeometryTransform(
        { wkid: 4326 },
        quantizationParameters,
      );
      result.should.deepEqual({
        originPosition: 'upperLeft',
        scale: {
          xScale: 1.0583354500042335,
          yScale: 1.0583354500042335,
        },
        translate: {
          xTranslate: 0,
          yTranslate: 0,
        },
      });
    });
  });

  it('from spatialReference, with UNIT.name = "degree"', () => {
    const result = getGeometryTransform({ wkid: 4326 });
    result.should.deepEqual({
      scale: {
        xScale: 1e-9,
        yScale: 1e-9,
      },
      translate: {
        xTranslate: 0,
        yTranslate: 0,
      },
    });
  });

  it('from spatialReference, with UNIT.convert', () => {
    const result = getGeometryTransform({ wkid: 3857 });
    result.should.deepEqual({
      scale: {
        xScale: 0.0001,
        yScale: 0.0001,
      },
      translate: {
        xTranslate: 0,
        yTranslate: 0,
      },
    });
  });

  it('from unknown spatial reference', () => {
    const result = getGeometryTransform({ wkid: 999 });
    result.should.deepEqual({
      scale: {
        xScale: 1,
        yScale: 1,
      },
      translate: {
        xTranslate: 0,
        yTranslate: 0,
      },
    });
  });

  it('from custom spatial reference', () => {
    const result = getGeometryTransform({
      wkt: 'PROJCRS["NAD83 / California zone 5 (ftUS)",BASEGEOGCRS["NAD83",DATUM["North American Datum 1983",ELLIPSOID["GRS 1980",6378137,298.257222101,LENGTHUNIT["metre",1]]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4269]],CONVERSION["SPCS83 California zone 5 (US Survey feet)",METHOD["Lambert Conic Conformal (2SP)",ID["EPSG",9802]],PARAMETER["Latitude of false origin",33.5,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8821]],PARAMETER["Longitude of false origin",-118,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8822]],PARAMETER["Latitude of 1st standard parallel",35.4666666666667,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8823]],PARAMETER["Latitude of 2nd standard parallel",34.0333333333333,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8824]],PARAMETER["Easting at false origin",6561666.667,LENGTHUNIT["US survey foot",0.304800609601219],ID["EPSG",8826]],PARAMETER["Northing at false origin",1640416.667,LENGTHUNIT["US survey foot",0.304800609601219],ID["EPSG",8827]]],CS[Cartesian,2],AXIS["easting (X)",east,ORDER[1],LENGTHUNIT["US survey foot",0.304800609601219]],AXIS["northing (Y)",north,ORDER[2],LENGTHUNIT["US survey foot",0.304800609601219]],USAGE[SCOPE["Engineering survey, topographic mapping."],AREA["United States (USA) - California - counties Kern; Los Angeles; San Bernardino; San Luis Obispo; Santa Barbara; Ventura."],BBOX[32.76,-121.42,35.81,-114.12]],ID["EPSG",2229]]',
    });
    result.should.deepEqual({
      scale: {
        xScale: 1,
        yScale: 1,
      },
      translate: {
        xTranslate: 0,
        yTranslate: 0,
      },
    });
  });
});
