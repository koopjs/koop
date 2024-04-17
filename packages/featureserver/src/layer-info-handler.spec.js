require('should');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const TableCreateSpy = sinon.spy(function () {
  return 'table-layer-metadata';
});
const FeatureLayerCreateSpy = sinon.spy(function () {
  return 'feature-layer-metadata';
});

describe('layerInfo handler', function () {
  const handlerSpy = sinon.spy();
  const req = {
    app: {
      locals: {},
    },
    body: {},
    query: {},
  };

  beforeEach(() => {
    handlerSpy.resetHistory();
  });

  it('isTable === true, returns TableLayerMetadata instance', () => {
    const isTableSpy = sinon.spy(function () {
      return true;
    });
    const layerMetadata = proxyquire('./layer-info-handler', {
      './helpers': {
        isTable: isTableSpy,
        TableLayerMetadata: { create: TableCreateSpy },
        FeatureLayerMetadata: { create: FeatureLayerCreateSpy },
      },
      './response-handlers': {
        generalResponseHandler: handlerSpy,
      },
    });
    layerMetadata(req, {}, { foo: 'bar' });
    handlerSpy.firstCall.args.should.deepEqual([{}, 'table-layer-metadata', {}]);
    isTableSpy.callCount.should.equal(1);
    isTableSpy.firstCall.args.should.deepEqual([{ foo: 'bar' }]);
    TableCreateSpy.callCount.should.equal(1);
    TableCreateSpy.firstCall.args.should.deepEqual([
      { foo: 'bar' },
      { inputCrs: undefined, sourceSR: undefined },
    ]);
    TableCreateSpy.resetHistory();
  });

  it('isTable === false, returns FeatureLayerMetadata instance', () => {
    const isTableSpy = sinon.spy(function () {
      return false;
    });
    const layerMetadata = proxyquire('./layer-info-handler', {
      './helpers': {
        isTable: isTableSpy,
        TableLayerMetadata: { create: TableCreateSpy },
        FeatureLayerMetadata: { create: FeatureLayerCreateSpy },
      },
      './response-handlers': {
        generalResponseHandler: handlerSpy,
      },
    });
    layerMetadata(req, {}, { foo: 'bar' });
    handlerSpy.firstCall.args.should.deepEqual([{}, 'feature-layer-metadata', {}]);
    isTableSpy.callCount.should.equal(1);
    isTableSpy.firstCall.args.should.deepEqual([{ foo: 'bar' }]);
    FeatureLayerCreateSpy.callCount.should.equal(1);
    FeatureLayerCreateSpy.firstCall.args.should.deepEqual([
      { foo: 'bar' },
      { inputCrs: undefined, sourceSR: undefined },
    ]);
    FeatureLayerCreateSpy.resetHistory();
  });
});
