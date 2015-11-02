/* global describe, it */

var should = require('should')
var exporter = require('../../lib/Exporter')
var snowData = require('../fixtures/snow.geojson')
var nock = require('nock')
var _ = require('lodash')

function noop () {}

describe('exporter Model', function () {
  describe('when exporting geojson', function () {
    it('should return an err when not given a format', function (done) {
      var format = null
      var dir = 'json'
      var key = 'snow-data'

      exporter.exportToFormat(format, dir, key, snowData, {}, function (err, file) {
        should.exist(err)
        should.not.exist(file)
        done()
      })
    })
  })

  describe('when exporting large data', function () {
    it('should return an err when not given a format', function (done) {
      var format = null
      var key = 'snow-data'

      exporter.exportLarge({}, format, 'dummy', key, 'agol', {}, noop, function (err, res) {
        should.exist(err)
        done()
      })
    })
  })

  describe('when creating id filters', function () {
    it('should create a correct idFilter if given an offset and limit', function (done) {
      var options = {
        offset: '1000',
        limit: 10
      }

      var filter = exporter.createIdFilter(options)
      filter.should.equal(' id >= 1000 AND id < 1010')
      done()
    })

    it('should return an undefined id filter if given no limit', function (done) {
      var options = {
        offset: '1000'
      }

      var filter = exporter.createIdFilter(options)
      should.not.exist(filter)
      done()
    })
  })

  describe('when creating paths for exports', function () {
    it('should return an object with files and paths', function (done) {
      var format = 'csv'
      var dir = 'testdir'
      var key = 'testkey'

      var options = {
        name: 'dummy'
      }

      var paths = exporter.createPaths(dir, key, format, options)
      paths.base.should.equal('.//files/' + dir + '/' + key)
      paths.newFile.should.equal('dummy.csv')
      done()
    })
  })

  describe('when creating ogr params for exports', function () {
    var geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: null,
          properties: {
            name: 'Foo',
            X: false,
            Y: false
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [125.6, 10.1]
          },
          properties: {
            name: 'Dinagat Islands',
            X: false,
            Y: false
          }
        }
      ]
    }

    it('should create a correct ogr string of commands for a csv when there are x y features', function (done) {
      var format = 'csv'
      var inFile = 'infile.json'
      var outFile = 'outfile.csv'

      var options = {
        name: 'dummy'
      }

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f CSV outfile.csv infile.json -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should create a correct ogr string of commands for a csv when there are not x or y features', function (done) {
      var format = 'csv'
      var inFile = 'infile.json'
      var outFile = 'outfile.csv'

      var options = {
        name: 'dummy'
      }

      var json = _.cloneDeep(geojson)
      delete json.features[0].properties.X
      delete json.features[0].properties.Y

      exporter.getOgrParams(format, inFile, outFile, json, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f CSV outfile.csv infile.json -lco WRITE_BOM=YES -lco GEOMETRY=AS_XY -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should create a valid ogr string for csv when there is no geometry', function (done) {
      var format = 'csv'
      var inFile = 'infile.json'
      var outFile = 'outfile.csv'

      var options = {
        name: 'dummy'
      }
      var json = _.cloneDeep(geojson)
      json.features[0].geometry = null
      json.features[1].geometry = null

      exporter.getOgrParams(format, inFile, outFile, json, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f CSV outfile.csv infile.json -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should create a correct ogr string of commands for a shapefile without srid', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy'
      }

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f "ESRI Shapefile" outfile.shp infile.json -nlt POINT -fieldmap identity -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should support WKID as an option for shapefiles', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        wkid: 102101
      }

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f "ESRI Shapefile" outfile.shp infile.json -nlt POINT -t_srs \'PROJCS["NGO_1948_Norway_Zone_1",GEOGCS["GCS_NGO_1948",DATUM["D_NGO_1948",SPHEROID["Bessel_Modified",6377492.018,299.1528128]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",6.05625],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",58.0],UNIT["Meter",1.0]]\' -fieldmap identity -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should create a correct ogr string of commands with a WKID', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        outSr: 2962
      }

      var fixture = nock('http://epsg.io')
      fixture.get('/2962.wkt').reply(200, 'PROJCS["NAD83(CSRS) / UTM zone 21N",GEOGCS["NAD83(CSRS)",DATUM["NAD83_Canadian_Spatial_Reference_System",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6140"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4617"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",-57],PARAMETER["scale_factor",0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],AUTHORITY["EPSG","2962"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]')

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f "ESRI Shapefile" outfile.shp infile.json -nlt POINT -t_srs \'PROJCS["NAD83(CSRS) / UTM zone 21N",GEOGCS["NAD83(CSRS)",DATUM["NAD83_Canadian_Spatial_Reference_System",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062],AUTHORITY["EPSG","6140"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4617"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",-57],PARAMETER["scale_factor",0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],AUTHORITY["EPSG","2962"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]\' -fieldmap identity -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should create a correct ogr string of commands with a latest WKID', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        outSr: {wkid: 102646, latestWkid: 2230}
      }

      var fixture = nock('http://epsg.io')
      fixture.get('/2230.wkt').reply(200, 'PROJCS["NAD83 / California zone 6 (ftUS)",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",33.88333333333333],PARAMETER["standard_parallel_2",32.78333333333333],PARAMETER["latitude_of_origin",32.16666666666666],PARAMETER["central_meridian",-116.25],PARAMETER["false_easting",6561666.667],PARAMETER["false_northing",1640416.667],AUTHORITY["EPSG","2230"],AXIS["X",EAST],AXIS["Y",NORTH]]')

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f "ESRI Shapefile" outfile.shp infile.json -nlt POINT -t_srs \'PROJCS["NAD83 / California zone 6 (ftUS)",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",33.88333333333333],PARAMETER["standard_parallel_2",32.78333333333333],PARAMETER["latitude_of_origin",32.16666666666666],PARAMETER["central_meridian",-116.25],PARAMETER["false_easting",6561666.667],PARAMETER["false_northing",1640416.667],AUTHORITY["EPSG","2230"],AXIS["X",EAST],AXIS["Y",NORTH]]\' -fieldmap identity -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should apply a datum transformation on 2927', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        outSr: {wkid: 2927, latestWkid: 2927}
      }

      var fixture = nock('http://epsg.io')
      fixture.get('/2927.wkt').reply(200, 'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]')

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f "ESRI Shapefile" outfile.shp infile.json -nlt POINT -t_srs \'PROJCS["NAD83(HARN) / Washington South (ftUS)",GEOGCS["NAD83(HARN)",DATUM["NAD83_High_Accuracy_Regional_Network",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062],AUTHORITY["EPSG","6152"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4152"]],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",47.33333333333334],PARAMETER["standard_parallel_2",45.83333333333334],PARAMETER["latitude_of_origin",45.33333333333334],PARAMETER["central_meridian",-120.5],PARAMETER["false_easting",1640416.667],PARAMETER["false_northing",0],AUTHORITY["EPSG","2927"],AXIS["X",EAST],AXIS["Y",NORTH]]\' -fieldmap identity -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })

    it('should apply the right transformation for 28892', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        outSr: {wkid: 28992, latestWkid: 28992}
      }

      var fixture = nock('http://epsg.io')
      fixture.get('/28992.wkt').reply(200, 'PROJCS["Amersfoort / RD New",GEOGCS["Amersfoort",DATUM["Amersfoort",SPHEROID["Bessel 1841",6377397.155,299.1528128,AUTHORITY["EPSG","7004"]],TOWGS84[565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725],AUTHORITY["EPSG","6289"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4289"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Oblique_Stereographic"],PARAMETER["latitude_of_origin",52.15616055555555],PARAMETER["central_meridian",5.38763888888889],PARAMETER["scale_factor",0.9999079],PARAMETER["false_easting",155000],PARAMETER["false_northing",463000],AUTHORITY["EPSG","28992"],AXIS["X",EAST],AXIS["Y",NORTH]]')

      exporter.getOgrParams(format, inFile, outFile, geojson, options, function (err, cmd) {
        should.not.exist(err)
        cmd.should.equal('ogr2ogr --config SHAPE_ENCODING UTF-8 -f "ESRI Shapefile" outfile.shp infile.json -nlt POINT -t_srs \'+title=Amersfoort/Amersfoort +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812\' -fieldmap identity -update -append -skipfailures -lco ENCODING=UTF-8')
        done()
      })
    })
  })
})
