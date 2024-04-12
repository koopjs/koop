const should = require('should');
should.config.checkProtoEql = false;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('filterAndTransform', () => {
  describe('should prepare parameters correctly', () => {
    afterEach(function () {
      filterAndTransformSpy.resetHistory();
      getCollectionCrsSpy.resetHistory();
    });

    const getCollectionCrsSpy = sinon.spy(function () {});

    const filterAndTransformSpy = sinon.spy(function () {
      return { features: 'expected-result' };
    });

    const stub = {
      '../helpers': {
        getCollectionCrs: getCollectionCrsSpy,
      },
      '@koopjs/winnow': {
        query: filterAndTransformSpy,
      },
    };

    const { filterAndTransform } = proxyquire('./filter-and-transform', stub);

    describe('should standardize parameters', () => {
      it('should convert "returnDistinctValues" to "distinct"', () => {
        const result = filterAndTransform({ features: [{}] }, { returnDistinctValues: true });
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          { inputCrs: 4326, toEsri: true, distinct: true, where: '1=1' },
        ]);
      });

      it('should set a default 1=1 for an undefined where', () => {
        const result = filterAndTransform({ features: [{}] }, {});
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          { inputCrs: 4326, toEsri: true, distinct: false, where: '1=1' },
        ]);
      });

      it('should remove "+" from where', () => {
        const result = filterAndTransform({ features: [{}] }, { where: 'FOO+IS+NOT+NULL' });
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          {
            inputCrs: 4326,
            toEsri: true,
            distinct: false,
            where: 'FOO IS NOT NULL',
          },
        ]);
      });

      it('should not remove "+" from where if wrapped in single quotes', () => {
        const result = filterAndTransform({ features: [{}] }, { where: "'FOO+'+IS+NOT+NULL" });
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          {
            inputCrs: 4326,
            toEsri: true,
            distinct: false,
            where: "'FOO+' IS NOT NULL",
          },
        ]);
      });

      it('should not remove "+" from where if wrapped in double quotes', () => {
        const result = filterAndTransform({ features: [{}] }, { where: '"FOO+"+IS+NOT+NULL' });
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          {
            inputCrs: 4326,
            toEsri: true,
            distinct: false,
            where: '"FOO+" IS NOT NULL',
          },
        ]);
      });
    });

    describe('should set toEsri:false and pass to filter/transform', () => {
      it('should set toEsri:false when requested format is geojson', () => {
        const result = filterAndTransform({ features: [{}] }, { f: 'geojson' });
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          {
            f: 'geojson',
            inputCrs: 4326,
            toEsri: false,
            distinct: false,
            where: '1=1',
          },
        ]);
      });

      it('should set toEsri:false when returnExtentOnly: true', () => {
        const result = filterAndTransform({ features: [{}] }, { returnExtentOnly: true });
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          {
            returnExtentOnly: true,
            inputCrs: 4326,
            toEsri: false,
            distinct: false,
            where: '1=1',
          },
        ]);
      });
    });

    describe('should properly set inputCrs and pass to filter/transform', () => {
      it('should get value from default', () => {
        const result = filterAndTransform({ features: [{}] }, {});
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          { inputCrs: 4326, toEsri: true, distinct: false, where: '1=1' },
        ]);
      });

      it('should get value from feature collection', () => {
        const getCollectionCrsSpy = sinon.spy(function () {
          return 'collection-crs';
        });

        const stub = {
          '../helpers': {
            getCollectionCrs: getCollectionCrsSpy,
          },
          '@koopjs/winnow': {
            query: filterAndTransformSpy,
          },
        };
        const { filterAndTransform } = proxyquire('./filter-and-transform', stub);
        const result = filterAndTransform({ features: [{}] }, {});
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { features: [{}] },
          {
            inputCrs: 'collection-crs',
            toEsri: true,
            distinct: false,
            where: '1=1',
          },
        ]);
      });

      it('should get value from metadata.crs', () => {
        const result = filterAndTransform({ metadata: { crs: 1234 }, features: [{}] }, {});
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { metadata: { crs: 1234 }, features: [{}] },
          { inputCrs: 1234, toEsri: true, distinct: false, where: '1=1' },
        ]);
      });

      it('should get value from sourceSR request parameter', () => {
        const result = filterAndTransform(
          { metadata: { crs: 1234 }, features: [{}] },
          { sourceSR: 4229 },
        );
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { metadata: { crs: 1234 }, features: [{}] },
          { inputCrs: 4229, toEsri: true, distinct: false, where: '1=1' },
        ]);
      });

      it('should get value from inputCrs request parameter', () => {
        const result = filterAndTransform(
          { metadata: { crs: 1234 }, features: [{}] },
          { sourceSR: 4229, inputCrs: 4673 },
        );
        result.should.deepEqual({
          features: 'expected-result',
        });
        filterAndTransformSpy.callCount.should.equal(1);
        filterAndTransformSpy.firstCall.args.should.deepEqual([
          { metadata: { crs: 1234 }, features: [{}] },
          { inputCrs: 4673, toEsri: true, distinct: false, where: '1=1' },
        ]);
      });
    });

    it('should remove params that were already applied', () => {
      const json = {
        filtersApplied: {
          projection: 'test',
          outSR: 'foo',
          offset: 1,
          resultOffset: 2,
          limit: 10,
          resultRecordOffset: 20,
        },
        features: [{}],
      };
      const result = filterAndTransform(json, {
        projection: 'test',
        outSR: 'foo',
        offset: 1,
        resultOffset: 2,
        limit: 10,
        resultRecordOffset: 20,
      });
      result.should.deepEqual({
        features: 'expected-result',
      });
      filterAndTransformSpy.callCount.should.equal(1);
      filterAndTransformSpy.firstCall.args.should.deepEqual([
        json,
        { inputCrs: 4326, toEsri: true, distinct: false, where: '1=1' },
      ]);
    });
  });

  describe('should generate statistics response', () => {
    afterEach(function () {
      filterAndTransformSpy.resetHistory();
      getCollectionCrsSpy.resetHistory();
    });
    const getCollectionCrsSpy = sinon.spy(function () {});

    const filterAndTransformSpy = sinon.spy(function () {
      return {
        min_precip: 10,
      };
    });

    const stub = {
      '../helpers': {
        getCollectionCrs: getCollectionCrsSpy,
      },
      '@koopjs/winnow': {
        query: filterAndTransformSpy,
      },
    };

    const { filterAndTransform } = proxyquire('./filter-and-transform', stub);

    it('should wrap statistics results and add in metadata', () => {
      const result = filterAndTransform(
        {
          features: [
            { properties: { precip: 10 } },
            { properties: { precip: 20 } },
            { properties: { precip: 30 } },
          ],
          metadata: {
            foo: 'bar',
          },
        },
        { outStatistics: [] },
      );
      result.should.deepEqual({
        statistics: { min_precip: 10 },
        metadata: {
          foo: 'bar',
        },
      });
      filterAndTransformSpy.callCount.should.equal(1);
      filterAndTransformSpy.firstCall.args.should.deepEqual([
        {
          features: [
            { properties: { precip: 10 } },
            { properties: { precip: 20 } },
            { properties: { precip: 30 } },
          ],
          metadata: {
            foo: 'bar',
          },
        },
        {
          distinct: false,
          inputCrs: 4326,
          toEsri: true,
          outStatistics: [],
          where: '1=1',
        },
      ]);
    });
  });
});
