require('should');
const {
  validateStatisticsParams,
  validateStatisticsRequest,
} = require('./validate-statistics-params');

describe('validateStatisticsParams', () => {
  const validStatistic = {
    onStatisticField: 'foo',
    outStatisticFieldName: 'total',
    statisticType: 'sum',
  };
  const validNames = ['a', '0', 'total', 'TOTAL', '123', 'total_123', 'total 123', '_ total_123 _'];
  const invalidNames = [
    '',
    ' ',
    '___',
    '_ _',
    'total-value',
    'total.value',
    'total!',
    'total\tvalue',
    'total\nvalue',
    'total\rvalue',
    'total\u00a0value',
    't\u00f3tal',
    '*',
    'sum(foo)',
    'foo + bar',
    'foo;bar',
  ];

  ['outStatisticFieldName', 'onStatisticField', 'groupByField'].forEach((field) => {
    validNames.forEach((name) => {
      it(`should accept ${field} ${JSON.stringify(name)}`, () => {
        (() => {
          validateStatisticsParams({
            outStatistics: [
              field === 'groupByField' ? validStatistic : { ...validStatistic, [field]: name },
            ],
            groupByFieldsForStatistics: field === 'groupByField' ? [name] : [],
          });
        }).should.not.throw();
      });
    });

    invalidNames.forEach((name) => {
      it(`should reject ${field} ${JSON.stringify(name)}`, () => {
        (() => {
          validateStatisticsParams({
            outStatistics: [
              field === 'groupByField' ? validStatistic : { ...validStatistic, [field]: name },
            ],
            groupByFieldsForStatistics: field === 'groupByField' ? [name] : [],
          });
        }).should.throw({
          code: 400,
          message:
            `Invalid configuration: ${field} "${name}" is invalid. ` +
            'It must contain only letters, numbers, spaces, and underscores, ' +
            'and must contain at least one letter or number.',
        });
      });
    });
  });

  ['count', 'sum', 'avg', 'var', 'max', 'min'].forEach((statisticType) => {
    it(`should accept statisticType "${statisticType}"`, () => {
      (() => {
        validateStatisticsParams({ outStatistics: [{ ...validStatistic, statisticType }] });
      }).should.not.throw();
    });
  });

  ['', 'SUM', 'sum ', ' sum', 'stddev', 'median', undefined, null, 1, true, ['sum']].forEach(
    (statisticType) => {
      it(`should reject statisticType ${JSON.stringify(statisticType)}`, () => {
        (() => {
          validateStatisticsParams({ outStatistics: [{ ...validStatistic, statisticType }] });
        }).should.throw({
          code: 400,
          message:
            `Invalid configuration: statisticType "${statisticType}" is invalid. ` +
            'It must be one of the following: count, sum, avg, var, max, min.',
        });
      });
    },
  );

  it('should reject an omitted statisticType', () => {
    (() => {
      validateStatisticsParams({
        outStatistics: [{ onStatisticField: 'foo', outStatisticFieldName: 'total' }],
      });
    }).should.throw({ code: 400 });
  });

  ['outStatisticFieldName', 'onStatisticField', 'statisticType'].forEach((field) => {
    it(`should validate ${field} of statistics after the first entry`, () => {
      (() => {
        validateStatisticsParams({
          outStatistics: [validStatistic, { ...validStatistic, [field]: 'invalid!' }],
        });
      }).should.throw({
        code: 400,
        message:
          `Invalid configuration: ${field} "invalid!" is invalid. ` +
          (field === 'statisticType'
            ? 'It must be one of the following: count, sum, avg, var, max, min.'
            : 'It must contain only letters, numbers, spaces, and underscores, ' +
              'and must contain at least one letter or number.'),
      });
    });
  });

  ['foo,,bar', 'foo,', ',foo', 'foo,   ,bar'].forEach((groupByFieldsForStatistics) => {
    it(`should reject an empty groupBy field in "${groupByFieldsForStatistics}"`, () => {
      (() => {
        validateStatisticsParams({
          outStatistics: [validStatistic],
          groupByFieldsForStatistics,
        });
      }).should.throw({
        code: 400,
        message:
          'Invalid configuration: groupByField "" is invalid. ' +
          'It must contain only letters, numbers, spaces, and underscores, ' +
          'and must contain at least one letter or number.',
      });
    });
  });

  [undefined, []].forEach((outStatistics) => {
    it(`should validate groupBy fields with outStatistics ${JSON.stringify(outStatistics)}`, () => {
      (() => {
        validateStatisticsParams({ outStatistics, groupByFieldsForStatistics: 'foo, invalid!' });
      }).should.throw({ code: 400 });
    });
  });

  it('should validate groupBy fields after the first entry', () => {
    (() => {
      validateStatisticsParams({
        outStatistics: [validStatistic],
        groupByFieldsForStatistics: ['foo', 'invalid!'],
      });
    }).should.throw({
      code: 400,
      message:
        'Invalid configuration: groupByField "invalid!" is invalid. ' +
        'It must contain only letters, numbers, spaces, and underscores, ' +
        'and must contain at least one letter or number.',
    });
  });

  [undefined, {}, { outStatistics: [] }, { outStatistics: [validStatistic] }].forEach(
    (parameters) => {
      it(`should not require field definitions: ${JSON.stringify(parameters)}`, () => {
        (() => validateStatisticsParams(parameters)).should.not.throw();
      });
    },
  );

  it('should preserve optional output names', () => {
    (() => {
      validateStatisticsParams({
        outStatistics: [{ onStatisticField: 'foo', statisticType: 'sum' }],
      });
    }).should.not.throw();
  });

  it('should normalize JSON statistics and comma-separated groupBy fields without mutation', () => {
    const body = {
      outStatistics: JSON.stringify([validStatistic]),
      groupByFieldsForStatistics: ' foo, bar_123 , field name ',
    };
    const original = { ...body };
    (() => validateStatisticsRequest({ body })).should.not.throw();
    body.should.deepEqual(original);
  });

  it('should give query parameters precedence over body parameters', () => {
    (() => {
      validateStatisticsRequest({
        body: { outStatistics: [{ ...validStatistic, statisticType: 'invalid!' }] },
        query: { outStatistics: JSON.stringify([validStatistic]) },
      });
    }).should.not.throw();
  });

  it('should ignore empty query values rather than overriding body parameters', () => {
    (() => {
      validateStatisticsRequest({
        body: { outStatistics: [{ ...validStatistic, statisticType: 'invalid!' }] },
        query: { outStatistics: '' },
      });
    }).should.throw({ code: 400 });
  });

  it('should ignore empty statistics parameters', () => {
    (() => {
      validateStatisticsRequest({ query: { outStatistics: '', groupByFieldsForStatistics: '' } });
    }).should.not.throw();
  });

  [null, {}, 'not-json', 1, true, [null], ['foo'], [1]].forEach((outStatistics) => {
    it(`should reject malformed outStatistics ${JSON.stringify(outStatistics)} with 400`, () => {
      (() => validateStatisticsParams({ outStatistics })).should.throw({ code: 400 });
    });
  });

  [null, {}, 1, true].forEach((groupByFieldsForStatistics) => {
    it(`should reject malformed groupBy ${JSON.stringify(groupByFieldsForStatistics)}`, () => {
      (() => validateStatisticsParams({ groupByFieldsForStatistics })).should.throw({ code: 400 });
    });
  });
});
