/* global describe, it */

var should = require('should')
var GeoJSON = require('../../lib/GeoJSON')
var esri_json = require('../fixtures/ski.geojson')

describe('GeoJSON Model', function () {
  describe('when converting esri style features to geojson', function () {
    it('should return a proper geojson object', function (done) {
      GeoJSON.fromEsri([], esri_json, function (err, geojson) {
        should.not.exist(err)
        geojson.should.be.an.instanceOf(Object)
        geojson.features.length.should.equal(esri_json.features.length)
        done()
      })
    })
  })

  describe('when converting fields with domains', function () {
    it('should return a proper geojson object', function (done) {
      var fields = [{
        name: 'NAME',
        type: 'esriFieldTypeSmallInteger',
        alias: 'NAME',
        domain: {
          type: 'codedValue',
          name: 'NAME',
          codedValues: [
            {
              name: 'Name0',
              code: 0
            },
            {
              name: 'Name1',
              code: 1
            }
          ]
        }
      }]

      var json = {
        features: [{
          attributes: {
            NAME: 0
          }
        }, {
          attributes: {
            NAME: 1
          }
        }]
      }

      GeoJSON.fromEsri(fields, json, function (err, geojson) {
        should.not.exist(err)
        geojson.should.be.an.instanceOf(Object)
        geojson.features.length.should.equal(json.features.length)
        geojson.features[0].properties.NAME.should.equal(fields[0].domain.codedValues[0].name)
        geojson.features[1].properties.NAME.should.equal(fields[0].domain.codedValues[1].name)
        done()
      })
    })
  })

})
