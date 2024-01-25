const should = require('should'); // eslint-disable-line
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const transformFeaturesForPbfSpy = sinon.spy(() => {
  return { pbf: 'json' };
});

const protoSpy = {
  encode: sinon.spy(() => {
    return protoSpy;
  }),
  finish: sinon.spy(() => {
    return {
      esri: 'pbf',
      length: 99,
    };
  }),
};

const { sendPbf } = proxyquire('./', {
  './transform-features-for-pbf.js': {
    transformFeaturesForPbf: transformFeaturesForPbfSpy,
  },
  './FeatureCollection.proto.js': {
    esriPBuffer: {
      FeatureCollectionPBuffer: protoSpy,
    },
  },
});

const res = {
  writeHead: sinon.spy(() => {
    return res;
  }),
  end: sinon.spy(),
};

describe('sendPbf', () => {
  afterEach(() => {
    protoSpy.encode.resetHistory();
    protoSpy.finish.resetHistory();
    transformFeaturesForPbfSpy.resetHistory();
  });

  it('return pbf of featureResult', () => {
    sendPbf(res, { esri: 'json' }, {});
    res.end.firstCall.args[0].should.deepEqual({
      esri: 'pbf',
      length: 99,
    });
    res.writeHead.firstCall.args.should.deepEqual([
      200,
      [
        ['content-type', 'application/x-protobuf'],
        ['content-length', 99],
        ['content-disposition', 'inline;filename=results.pbf'],
      ],
    ]);
    transformFeaturesForPbfSpy.firstCall.args.should.deepEqual([
      { esri: 'json' },
      undefined,
    ]);
    protoSpy.encode.firstCall.args.should.deepEqual([
      {
        queryResult: {
          Results: 'featureResult',
          featureResult: {
            pbf: 'json',
          },
        },
      },
    ]);
    protoSpy.finish.called.should.equal(true);
  });

  it('return pbf of countResult', () => {
    sendPbf(res, { esri: 'json' }, { returnCountOnly: true });
    res.end.firstCall.args[0].should.deepEqual({
      esri: 'pbf',
      length: 99,
    });
    res.writeHead.firstCall.args.should.deepEqual([
      200,
      [
        ['content-type', 'application/x-protobuf'],
        ['content-length', 99],
        ['content-disposition', 'inline;filename=results.pbf'],
      ],
    ]);
    transformFeaturesForPbfSpy.called.should.equal(false);

    protoSpy.encode.firstCall.args.should.deepEqual([
      {
        queryResult: {
          Results: 'countResult',
          countResult: {
            esri: 'json',
          },
        },
      },
    ]);
    protoSpy.finish.called.should.equal(true);
  });

  it('return pbf of idsResult', () => {
    sendPbf(res, { esri: 'json' }, { returnIdsOnly: true });
    res.end.firstCall.args[0].should.deepEqual({
      esri: 'pbf',
      length: 99,
    });
    res.writeHead.firstCall.args.should.deepEqual([
      200,
      [
        ['content-type', 'application/x-protobuf'],
        ['content-length', 99],
        ['content-disposition', 'inline;filename=results.pbf'],
      ],
    ]);
    transformFeaturesForPbfSpy.called.should.equal(false);

    protoSpy.encode.firstCall.args.should.deepEqual([
      {
        queryResult: {
          Results: 'idsResult',
          idsResult: {
            esri: 'json',
          },
        },
      },
    ]);
    protoSpy.finish.called.should.equal(true);
  });

  it('fail on returnExtentOnly', () => {
    try {
      sendPbf(res, { esri: 'json' }, { returnExtentOnly: true });
      throw new Error('should have thrown');
    } catch (error) {
      error.message.should.equal('Bad Request');
      error.code.should.equal(400);
    }
  });
});
