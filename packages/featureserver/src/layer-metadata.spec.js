const should = require('should');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const TableCreateSpy = sinon.spy(function () {
  return 'table-layer-metadata';
});
const FeatureLayerCreateSpy = sinon.spy(function () {
  return 'feature-layer-metadata';
});

describe('layerMetadata', function () {
  it('isTable === true, returns TableLayerMetadata instance', () => {
    const isTableSpy = sinon.spy(function () {
      return true;
    });
    const layerMetadata = proxyquire('./layer-metadata', {
      './helpers': {
        isTable: isTableSpy,
        TableLayerMetadata: { create: TableCreateSpy },
        FeatureLayerMetadata: { create: FeatureLayerCreateSpy },
      },
    });
    const result = layerMetadata({ foo: 'bar' }, { sna: 'fu' });
    should(result).deepEqual('table-layer-metadata');
    isTableSpy.callCount.should.equal(1);
    isTableSpy.firstCall.args.should.deepEqual([{ foo: 'bar', sna: 'fu' }]);
    TableCreateSpy.callCount.should.equal(1);
    TableCreateSpy.firstCall.args.should.deepEqual([{ foo: 'bar' }, { sna: 'fu' }]);
    TableCreateSpy.resetHistory();
  });

  it('isTable === false, returns FeatureLayerMetadata instance', () => {
    const isTableSpy = sinon.spy(function () {
      return false;
    });
    const layerMetadata = proxyquire('./layer-metadata', {
      './helpers': {
        isTable: isTableSpy,
        TableLayerMetadata: { create: TableCreateSpy },
        FeatureLayerMetadata: { create: FeatureLayerCreateSpy },
      },
    });
    const result = layerMetadata({ foo: 'bar' }, { sna: 'fu' });
    should(result).deepEqual('feature-layer-metadata');
    isTableSpy.callCount.should.equal(1);
    isTableSpy.firstCall.args.should.deepEqual([{ foo: 'bar', sna: 'fu' }]);
    FeatureLayerCreateSpy.callCount.should.equal(1);
    FeatureLayerCreateSpy.firstCall.args.should.deepEqual([{ foo: 'bar' }, { sna: 'fu' }]);
    FeatureLayerCreateSpy.resetHistory();
  });
});
