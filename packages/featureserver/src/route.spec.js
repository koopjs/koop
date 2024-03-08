const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
require('should-sinon');
const proxyquire = require('proxyquire');

describe('Route module unit tests', () => {
  describe('/query route', () => {
    const querySpy = sinon.spy(function () {
      return {
        features: [],
      };
    });

    const responseHandlerSpy = sinon.spy();

    const route = proxyquire('./route', {
      './query': querySpy,
      './response-handlers': {
        generalResponseHandler: responseHandlerSpy,
        queryResponseHandler: responseHandlerSpy,
      },
    });

    it('should use query handler and return 200', () => {
      route(
        {
          params: { method: 'query' },
          query: {},
          url: '/FeatureServer/0/query',
        },
        {},
        {},
      );
      querySpy.calledOnce.should.equal(true);
      querySpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          resultRecordCount: 2000,
        },
      ]);
      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        { features: [] },
        { resultRecordCount: 2000 },
      ]);
    });

    it('should use query handler and handle error', () => {
      const querySpy = sinon.spy(function () {
        throw new Error('Fool bar');
      });

      const route = proxyquire('./route', {
        './query': querySpy,
        './response-handlers': { generalResponseHandler: responseHandlerSpy },
      });

      route(
        {
          params: { method: 'query' },
          query: {},
          url: '/FeatureServer/0/query',
        },
        {},
        {},
      );
      querySpy.calledOnce.should.equal(true);
      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        {
          error: {
            code: 500,
            message: 'Fool bar',
            details: ['Fool bar'],
          },
        },
        { resultRecordCount: 2000 },
      ]);
    });
    afterEach(() => {
      querySpy.resetHistory();
      responseHandlerSpy.resetHistory();
    });
  });

  describe('/rest/info route', () => {
    const restInfoSpy = sinon.spy(function () {
      return { restInfo: true };
    });

    const responseHandlerSpy = sinon.spy();

    const route = proxyquire('./route', {
      './rest-info-route-handler': restInfoSpy,
      './response-handlers': { generalResponseHandler: responseHandlerSpy },
    });

    it('should use restInfo handler and return 200', () => {
      route(
        {
          params: {},
          query: {},
          url: '/rest/info',
        },
        {},
        {},
      );
      restInfoSpy.calledOnce.should.equal(true);
      restInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/info',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        { restInfo: true },
        { resultRecordCount: 2000 },
      ]);
    });

    it('should use restInfo handler and return 500', () => {
      const restInfoSpy = sinon.spy(function () {
        throw new Error('Fool bar');
      });
      const route = proxyquire('./route', {
        './rest-info-route-handler': restInfoSpy,
        './response-handlers': { generalResponseHandler: responseHandlerSpy },
      });

      route(
        {
          params: {},
          query: {},
          url: '/rest/info',
        },
        {},
        {},
      );
      restInfoSpy.calledOnce.should.equal(true);
      restInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/info',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        {
          error: {
            code: 500,
            message: 'Fool bar',
            details: ['Fool bar'],
          },
        },
        { resultRecordCount: 2000 },
      ]);
    });

    afterEach(() => {
      restInfoSpy.resetHistory();
      responseHandlerSpy.resetHistory();
    });
  });

  describe('/FeatureServer route', () => {
    const serverInfoSpy = sinon.spy(function () {
      return { serverInfo: true };
    });

    const responseHandlerSpy = sinon.spy();

    const route = proxyquire('./route', {
      './server-info-route-handler': serverInfoSpy,
      './response-handlers': { generalResponseHandler: responseHandlerSpy },
    });

    it('should use serverInfo handler and return 200', () => {
      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer',
        },
        {},
        {},
      );
      serverInfoSpy.calledOnce.should.equal(true);
      serverInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/services/test/FeatureServer',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        { serverInfo: true },
        { resultRecordCount: 2000 },
      ]);
    });

    it('should use serverInfo handler and return 500', () => {
      const serverInfoSpy = sinon.spy(function () {
        throw new Error('Fool bar');
      });
      const route = proxyquire('./route', {
        './server-info-route-handler': serverInfoSpy,
        './response-handlers': { generalResponseHandler: responseHandlerSpy },
      });

      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer',
        },
        {},
        {},
      );
      serverInfoSpy.calledOnce.should.equal(true);
      serverInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/services/test/FeatureServer',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        {
          error: {
            code: 500,
            message: 'Fool bar',
            details: ['Fool bar'],
          },
        },
        { resultRecordCount: 2000 },
      ]);
    });

    afterEach(() => {
      serverInfoSpy.resetHistory();
      responseHandlerSpy.resetHistory();
    });
  });

  describe('/FeatureServer/layers route', () => {
    const layersInfoSpy = sinon.spy(function () {
      return { layersInfo: true };
    });

    const responseHandlerSpy = sinon.spy();

    const route = proxyquire('./route', {
      './layers-metadata': layersInfoSpy,
      './response-handlers': { generalResponseHandler: responseHandlerSpy },
    });

    it('should use layersInfo handler and return 200', () => {
      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer/layers',
        },
        {},
        {},
      );
      layersInfoSpy.calledOnce.should.equal(true);
      layersInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          resultRecordCount: 2000,
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        { layersInfo: true },
        { resultRecordCount: 2000 },
      ]);
    });

    it('should use layersInfo handler and return 500', () => {
      const layersInfoSpy = sinon.spy(function () {
        throw new Error('Fool bar');
      });
      const route = proxyquire('./route', {
        './layers-metadata': layersInfoSpy,
        './response-handlers': { generalResponseHandler: responseHandlerSpy },
      });

      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer/layers',
        },
        {},
        {},
      );
      layersInfoSpy.calledOnce.should.equal(true);
      layersInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          resultRecordCount: 2000,
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        {
          error: {
            code: 500,
            message: 'Fool bar',
            details: ['Fool bar'],
          },
        },
        { resultRecordCount: 2000 },
      ]);
    });

    afterEach(() => {
      layersInfoSpy.resetHistory();
      responseHandlerSpy.resetHistory();
    });
  });

  describe('/FeatureServer/0 route', () => {
    const layerInfoSpy = sinon.spy(function () {
      return 'layer-metadata';
    });

    const responseHandlerSpy = sinon.spy();

    const route = proxyquire('./route', {
      './layer-metadata': layerInfoSpy,
      './response-handlers': { generalResponseHandler: responseHandlerSpy },
    });

    it('should use layerInfo handler and return 200', () => {
      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer/0',
        },
        {},
        {},
      );
      layerInfoSpy.calledOnce.should.equal(true);
      layerInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/services/test/FeatureServer/0',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        'layer-metadata',
        { resultRecordCount: 2000 },
      ]);
    });

    it('should use layerInfo handler and return 500', () => {
      const layerInfoSpy = sinon.spy(function () {
        throw new Error('Fool bar');
      });
      const route = proxyquire('./route', {
        './layer-metadata': layerInfoSpy,
        './response-handlers': { generalResponseHandler: responseHandlerSpy },
      });

      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer/0',
        },
        {},
        {},
      );
      layerInfoSpy.calledOnce.should.equal(true);
      layerInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/services/test/FeatureServer/0',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        {
          error: {
            code: 500,
            message: 'Fool bar',
            details: ['Fool bar'],
          },
        },
        { resultRecordCount: 2000 },
      ]);
    });

    afterEach(() => {
      layerInfoSpy.resetHistory();
      responseHandlerSpy.resetHistory();
    });
  });

  describe('/FeatureServer/0/info route', () => {
    const layerInfoSpy = sinon.spy(function () {
      return 'layer-metadata';
    });

    const responseHandlerSpy = sinon.spy();

    const route = proxyquire('./route', {
      './layer-metadata': layerInfoSpy,
      './response-handlers': { generalResponseHandler: responseHandlerSpy },
    });

    it('should use layerInfo handler and return 200', () => {
      route(
        {
          params: {},
          query: {},
          url: '/rest/services/test/FeatureServer/0/info',
        },
        {},
        {},
      );
      layerInfoSpy.calledOnce.should.equal(true);
      layerInfoSpy.firstCall.args.should.deepEqual([
        {
          metadata: { maxRecordCount: 2000 },
        },
        {
          params: {},
          query: { resultRecordCount: 2000 },
          url: '/rest/services/test/FeatureServer/0/info',
        },
      ]);

      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        'layer-metadata',
        { resultRecordCount: 2000 },
      ]);
    });

    afterEach(() => {
      layerInfoSpy.resetHistory();
      responseHandlerSpy.resetHistory();
    });
  });

  describe('unknown route', () => {
    it('should handle unknown route', () => {
      const responseHandlerSpy = sinon.spy();
      const route = proxyquire('./route', {
        './response-handlers': { generalResponseHandler: responseHandlerSpy },
      });

      route(
        {
          params: {},
          query: {},
          url: '/hello/world',
        },
        {},
        {},
      );
      responseHandlerSpy.calledOnce.should.equal(true);
      responseHandlerSpy.firstCall.args.should.deepEqual([
        {},
        {
          error: {
            code: 404,
            message: 'Not Found',
            details: ['Not Found'],
          },
        },
        { resultRecordCount: 2000 },
      ]);
    });
  });
});
