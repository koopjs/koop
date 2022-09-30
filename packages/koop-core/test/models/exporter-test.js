/* global describe, it */

var should = require('should')
var exporter = require('../../lib/Exporter')
var snowData = require('../fixtures/snow.geojson')

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
    it('should create a correct ogr string of commands', function (done) {
      var format = 'csv'
      var inFile = 'infile.json'
      var outFile = 'outfile.csv'

      var options = {
        name: 'dummy'
      }

      var params = exporter.getOgrParams(format, inFile, outFile, null, options).split(' ')
      params[6].should.equal(outFile)
      params[7].should.equal(inFile)
      done()
    })

    it('should support WKID as an option for shapefiles', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        wkid: 102101
      }

      var params = exporter.getOgrParams(format, inFile, outFile, null, options).split(' ')
      params[7].should.equal(outFile)
      params[8].should.equal(inFile)
      done()
    })

    it('should create a correct ogr string of commands with a WKID', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        outSR: 2962
      }
      var params = exporter.getOgrParams(format, inFile, outFile, null, options).split(' ')
      params[10].should.equal('\'PROJCS["NAD_1983_CSRS_UTM_Zone_21N",GEOGCS["GCS_North_American_1983_CSRS",DATUM["D_North_American_1983_CSRS",SPHEROID["GRS_1980",6378137.0,298.257222101],TOWGS84[-0.9956,1.9013,0.5215,0.025915,0.009426,0.011599,-0.00062]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-57.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]\'')
      // make sure the format is "Esri Shapefile"
      var outFormat = params[5] + ' ' + params[6]
      outFormat.should.equal('"ESRI Shapefile"')
      done()
    })

    it('should create a correct ogr string of commands with a latest WKID', function (done) {
      var format = 'zip'
      var inFile = 'infile.json'
      var outFile = 'outfile.shp'

      var options = {
        name: 'dummy',
        outSR: {wkid: 102646, latestWkid: 2230}
      }
      var params = exporter.getOgrParams(format, inFile, outFile, null, options).split(' ')
      params[10].should.equal('\'PROJCS["NAD_1983_StatePlane_California_VI_FIPS_0406_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["False_Easting",6561666.666666666],PARAMETER["False_Northing",1640416.666666667],PARAMETER["Central_Meridian",-116.25],PARAMETER["Standard_Parallel_1",32.78333333333333],PARAMETER["Standard_Parallel_2",33.88333333333333],PARAMETER["Latitude_Of_Origin",32.16666666666666],UNIT["Foot_US",0.3048006096012192]]\'')
      // make sure the format is "Esri Shapefile"
      var outFormat = params[5] + ' ' + params[6]
      outFormat.should.equal('"ESRI Shapefile"')
      done()
    })
  })
})
