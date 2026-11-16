require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('query handler', () => {
  const handlerSpy = sinon.spy();
  const querySpy = sinon.spy(() => {
    return { foo: 'bar' };
  });
  const query = proxyquire('./index', {
    '../response-handlers': {
      queryResponseHandler: handlerSpy,
    },
    './query-json': { queryJson: querySpy },
  });

  afterEach(() => {
    handlerSpy.resetHistory();
    querySpy.resetHistory();
  });

  it('should pass query result to query handler', () => {
    const req = {
      app: {
        locals: {},
      },
      query: {},
      body: {},
    };

    query(req, {});
    handlerSpy.callCount.should.equal(1);
    handlerSpy.firstCall.args.should.deepEqual([
      {},
      {
        foo: 'bar',
      },
      { resultRecordCount: 2000 },
    ]);
  });

  const validStatistic = {
    onStatisticField: 'foo',
    outStatisticFieldName: 'total',
    statisticType: 'sum',
  };

  ['body', 'query'].forEach((source) => {
    ['outStatisticFieldName', 'onStatisticField', 'statisticType', 'groupByField'].forEach(
      (field) => {
        it(`should reject invalid ${field} in ${source} before processing data`, () => {
          const req = {
            [source]: {
              outStatistics: JSON.stringify([
                field === 'groupByField'
                  ? validStatistic
                  : { ...validStatistic, [field]: 'invalid!' },
              ]),
              groupByFieldsForStatistics: field === 'groupByField' ? 'foo, invalid!' : 'foo',
            },
          };

          (() => query(req, {})).should.throw({ code: 400 });
          querySpy.called.should.equal(false);
          handlerSpy.called.should.equal(false);
        });
      },
    );
  });

  it('should reject invalid groupBy fields without outStatistics before processing data', () => {
    (() => {
      query({ query: { groupByFieldsForStatistics: 'invalid!' } }, {});
    }).should.throw({ code: 400 });
    querySpy.called.should.equal(false);
    handlerSpy.called.should.equal(false);
  });

  it('should pass normalized valid statistics parameters to query processing', () => {
    const req = {
      body: { outStatistics: JSON.stringify([validStatistic]) },
      query: { groupByFieldsForStatistics: 'foo, bar' },
    };
    const data = { statistics: { total: 3 } };

    query(req, {}, data);

    querySpy.firstCall.args.should.deepEqual([
      data,
      { outStatistics: [validStatistic], groupByFieldsForStatistics: 'foo, bar' },
    ]);
    handlerSpy.calledOnce.should.equal(true);
  });

  [
    {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: { foo: 1 }, geometry: null },
        { type: 'Feature', properties: { foo: 2 }, geometry: null },
      ],
    },
    { statistics: { total: 3 } },
  ].forEach((data) => {
    it(`should render valid ${data.statistics ? 'precalculated' : 'calculated'} statistics`, () => {
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      require('./index')({ query: { outStatistics: JSON.stringify([validStatistic]) } }, res, data);

      res.status.calledWith(200).should.equal(true);
      const [payload] = res.json.firstCall.args;
      payload.features.should.deepEqual([{ attributes: { total: 3 } }]);
      payload.fields.map(({ name }) => name).should.deepEqual(['total']);
    });
  });
});
