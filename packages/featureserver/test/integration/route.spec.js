const FeatureServer = require('../../src');
const request = require('supertest');
const express = require('express');
require('should');
const _ = require('lodash');
const snow = require('./fixtures/snow.json');
const relatedData = require('./fixtures/relatedData.json');
const app = express();

let data;

const serverHander = (req, res) => {
  FeatureServer.route(req, res, {
    description: 'test',
    layers: [data, data],
  });
};
const handler = (req, res) => FeatureServer.route(req, res, data);

app.get('/FeatureServer', serverHander);
app.get('/FeatureServer/info', serverHander);
app.get('/FeatureServer/layers', handler);
app.get('/FeatureServer/:layer', handler);
app.get('/FeatureServer/:layer/:method', handler);

describe('Routing feature server requests', () => {
  beforeEach(() => {
    data = _.cloneDeep(snow);
    data.name = 'Snow';
  });

  describe('generateRenderer', () => {
    describe('when statistics are passed in', () => {
      beforeEach(() => {
        data = _.cloneDeep({
          type: 'FeatureCollection',
          metadata: {
            name: 'GDeltGKG',
          },
          statistics: {
            classBreaks: [
              [80, 147],
              [147, 174],
              [174, 195],
              [195, 218],
              [240, 270],
              [307, 360],
              [360, 558],
              [558, 799],
              [799, 2000],
            ],
          },
        });
      });
      it('should handle a provider passing in class breaks statistics', (done) => {
        request(app)
          .get('/FeatureServer/3/generateRenderer?')
          .expect((res) => {
            res.body.type.should.equal('classBreaks');
            res.body.classBreakInfos.length.should.equal(9);
            res.body.classBreakInfos[0].symbol.color.should.deepEqual([0, 255, 0]);
            res.body.classBreakInfos[0].label.should.equal('80-147');
            res.body.classBreakInfos[4].symbol.color.should.deepEqual([0, 255, 255]);
            res.body.classBreakInfos[8].symbol.color.should.deepEqual([0, 0, 255]);
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
      it('should ignore options when statistics are passed in', (done) => {
        request(app)
          .get(
            '/FeatureServer/3/generateRenderer?' +
              'classificationDef={' +
              '"type": "classBreaksDef",' +
              '"classificationField": "daily snow total",' +
              '"classificationMethod": "esriClassifyEqualInterval",' +
              '"breakCount": 9}&' +
              'where=&' +
              'gdbVersion=&' +
              'f=json',
          )
          .expect((res) => {
            res.body.type.should.equal('classBreaks');
            res.body.classBreakInfos.length.should.equal(9);
            res.body.classBreakInfos[0].symbol.color.should.deepEqual([0, 255, 0]);
            res.body.classBreakInfos[0].label.should.equal('80-147');
            res.body.classBreakInfos[4].symbol.color.should.deepEqual([0, 255, 255]);
            res.body.classBreakInfos[8].symbol.color.should.deepEqual([0, 0, 255]);
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    it('should properly route and handle a generate renderer request', (done) => {
      request(app)
        .get(
          '/FeatureServer/3/generateRenderer?' +
            'classificationDef={' +
            '"type": "classBreaksDef",' +
            '"classificationField": "daily snow total",' +
            '"classificationMethod": "esriClassifyEqualInterval",' +
            '"breakCount": 7,' +
            '"colorRamp": {' +
            '"type": "algorithmic",' +
            '"fromColor": [0, 100, 0, 255],' +
            '"toColor": [0, 0, 255, 255],' +
            '"algorithm": "esriHSVAlgorithm"}' +
            '}&' +
            'where=latitude < 39 AND latitude > 38.5&' +
            'f=json',
        )
        .expect((res) => {
          res.body.type.should.equal('classBreaks');
          res.body.classBreakInfos.length.should.equal(7);
          res.body.classBreakInfos[0].symbol.color.should.deepEqual([0, 100, 0]);
          res.body.classBreakInfos[0].label.should.equal('0-0.7571428571428571');
          res.body.classBreakInfos[3].symbol.color.should.deepEqual([0, 177, 178]);
          res.body.classBreakInfos[6].symbol.color.should.deepEqual([0, 0, 255]);
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('queryRelatedRecords', () => {
    describe('when objectIds are passed in', () => {
      beforeEach(() => {
        data = _.cloneDeep(relatedData);
      });
      it('should properly route and handle return related records result', (done) => {
        request(app)
          .get('/FeatureServer/0/queryRelatedRecords?')
          .expect((res) => {
            res.body.relatedRecordGroups.length.should.equal(1);
            res.body.relatedRecordGroups[0].relatedRecords.length.should.equal(11);
          })
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
  });
});
