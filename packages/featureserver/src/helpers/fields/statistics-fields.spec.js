const should = require('should');
should.config.checkProtoEql = false;
const StatisticsFields = require('./statistics-fields');

describe('StatisticsFields', () => {
  describe('outStatistics configuration validation', () => {
    const fieldDefinitions = [{ name: 'foo', type: 'Double' }];
    const validStatistic = {
      onStatisticField: 'foo',
      outStatisticFieldName: 'total',
      statisticType: 'sum',
    };
    const validNames = [
      'a',
      '0',
      'total',
      'TOTAL',
      '123',
      'total_123',
      'total 123',
      '_ total_123 _',
    ];
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
            return new StatisticsFields({
              statisticsSample: {},
              fieldDefinitions,
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
            return new StatisticsFields({
              statisticsSample: {},
              fieldDefinitions,
              outStatistics: [
                field === 'groupByField' ? validStatistic : { ...validStatistic, [field]: name },
              ],
              groupByFieldsForStatistics: field === 'groupByField' ? [name] : [],
            });
          }).should.throw(
            `Invalid configuration: ${field} "${name}" is invalid. ` +
              'It must contain only letters, numbers, spaces, and underscores, ' +
              'and must contain at least one letter or number.',
          );
        });
      });
    });

    ['count', 'sum', 'avg', 'var', 'max', 'min'].forEach((statisticType) => {
      it(`should accept statisticType "${statisticType}"`, () => {
        (() => {
          return new StatisticsFields({
            statisticsSample: {},
            outStatistics: [{ ...validStatistic, statisticType }],
          });
        }).should.not.throw();
      });
    });

    ['', 'SUM', 'sum ', ' sum', 'stddev', 'median', undefined, null, 1, true, ['sum']].forEach(
      (statisticType) => {
        it(`should reject statisticType ${JSON.stringify(statisticType)}`, () => {
          (() => {
            return new StatisticsFields({
              statisticsSample: {},
              outStatistics: [{ ...validStatistic, statisticType }],
            });
          }).should.throw(
            `Invalid configuration: statisticType "${statisticType}" is invalid. ` +
              'It must be one of the following: count, sum, avg, var, max, min.',
          );
        });
      },
    );

    it('should reject an omitted statisticType', () => {
      (() => {
        return new StatisticsFields({
          statisticsSample: {},
          outStatistics: [{ onStatisticField: 'foo', outStatisticFieldName: 'total' }],
        });
      }).should.throw(
        'Invalid configuration: statisticType "undefined" is invalid. ' +
          'It must be one of the following: count, sum, avg, var, max, min.',
      );
    });

    ['outStatisticFieldName', 'onStatisticField', 'statisticType', 'groupByField'].forEach(
      (field) => {
        it(`should validate ${field} through the static create method`, () => {
          (() => {
            return StatisticsFields.create({
              statistics: { total: 1 },
              outStatistics: [
                field === 'groupByField'
                  ? validStatistic
                  : { ...validStatistic, [field]: 'invalid!' },
              ],
              groupByFieldsForStatistics: field === 'groupByField' ? 'foo, invalid!' : [],
            });
          }).should.throw(
            `Invalid configuration: ${field} "invalid!" is invalid. ` +
              (field === 'statisticType'
                ? 'It must be one of the following: count, sum, avg, var, max, min.'
                : 'It must contain only letters, numbers, spaces, and underscores, ' +
                  'and must contain at least one letter or number.'),
          );
        });
      },
    );

    it('should accept multiple normalized groupBy fields through the static create method', () => {
      const result = StatisticsFields.create({
        statistics: { total: 1 },
        outStatistics: [validStatistic],
        groupByFieldsForStatistics: ' foo, bar_123 , field name ',
      });

      result.map(({ name }) => name).should.deepEqual(['total']);
    });

    ['foo,,bar', 'foo,', ',foo', 'foo,   ,bar'].forEach((groupByFieldsForStatistics) => {
      it(`should reject an empty groupBy field in "${groupByFieldsForStatistics}"`, () => {
        (() => {
          return StatisticsFields.create({
            statistics: { total: 1 },
            outStatistics: [validStatistic],
            groupByFieldsForStatistics,
          });
        }).should.throw(
          'Invalid configuration: groupByField "" is invalid. ' +
            'It must contain only letters, numbers, spaces, and underscores, ' +
            'and must contain at least one letter or number.',
        );
      });
    });

    it('should accept a statistic when field definitions are omitted', () => {
      (() => {
        return new StatisticsFields({
          statisticsSample: {},
          outStatistics: [validStatistic],
        });
      }).should.not.throw();
    });

    it('should accept source fields without matching field definitions', () => {
      (() => {
        return new StatisticsFields({
          statisticsSample: {},
          fieldDefinitions,
          outStatistics: [
            { ...validStatistic, onStatisticField: 'Foo', outStatisticFieldName: 'total_foo' },
            { ...validStatistic, onStatisticField: 'bar', outStatisticFieldName: 'total_bar' },
          ],
        });
      }).should.not.throw();
    });

    ['outStatisticFieldName', 'onStatisticField', 'statisticType'].forEach((field) => {
      it(`should validate ${field} of statistics after the first entry`, () => {
        (() => {
          return new StatisticsFields({
            statisticsSample: {},
            outStatistics: [validStatistic, { ...validStatistic, [field]: 'invalid!' }],
          });
        }).should.throw(
          `Invalid configuration: ${field} "invalid!" is invalid. ` +
            (field === 'statisticType'
              ? 'It must be one of the following: count, sum, avg, var, max, min.'
              : 'It must contain only letters, numbers, spaces, and underscores, ' +
                'and must contain at least one letter or number.'),
        );
      });
    });

    it('should validate groupBy fields after the first entry', () => {
      (() => {
        return new StatisticsFields({
          statisticsSample: {},
          outStatistics: [validStatistic],
          groupByFieldsForStatistics: ['foo', 'invalid!'],
        });
      }).should.throw(
        'Invalid configuration: groupByField "invalid!" is invalid. ' +
          'It must contain only letters, numbers, spaces, and underscores, ' +
          'and must contain at least one letter or number.',
      );
    });

    it('should accept an empty outStatistics array without field definitions', () => {
      (() => {
        return new StatisticsFields({ statisticsSample: {}, outStatistics: [] });
      }).should.not.throw();
    });

    it('should accept omitted outStatistics and field definitions', () => {
      (() => {
        return new StatisticsFields({ statisticsSample: {} });
      }).should.not.throw();
    });
  });

  describe('static normalizeOptions method', () => {
    it('should use first element of statistics array as sample', () => {
      const { statisticsSample } = StatisticsFields.normalizeOptions({
        statistics: [{ foo: '1.234' }],
      });

      statisticsSample.should.deepEqual({ foo: '1.234' });
    });

    it('should use statistics object as sample', () => {
      const { statisticsSample } = StatisticsFields.normalizeOptions({
        statistics: { foo: '1.234' },
      });
      statisticsSample.should.deepEqual({ foo: '1.234' });
    });

    it('should defer to fieldsDefinitions when supplied', () => {
      const { fieldDefinitions } = StatisticsFields.normalizeOptions({
        fieldDefinitions: 'foo',
        fields: 'bar',
        metadata: {
          fields: 'snafu',
        },
      });

      fieldDefinitions.should.equal('foo');
    });

    it('should defer to root-level "fields" when supplied', () => {
      const { fieldDefinitions } = StatisticsFields.normalizeOptions({
        fields: 'bar',
        metadata: {
          fields: 'snafu',
        },
      });

      fieldDefinitions.should.equal('bar');
    });

    it('should use "metadata.fields" when supplied', () => {
      const { fieldDefinitions } = StatisticsFields.normalizeOptions({
        metadata: {
          fields: 'snafu',
        },
      });

      fieldDefinitions.should.equal('snafu');
    });

    it('should convert groupByFieldsForStatistics string to array and remove whitespace', () => {
      const { groupByFieldsForStatistics } = StatisticsFields.normalizeOptions({
        groupByFieldsForStatistics: 'hello, world , today ',
      });

      groupByFieldsForStatistics.should.deepEqual(['hello', 'world', 'today']);
    });

    it('should use groupByFieldsForStatistics array', () => {
      const { groupByFieldsForStatistics } = StatisticsFields.normalizeOptions({
        groupByFieldsForStatistics: ['hello'],
      });

      groupByFieldsForStatistics.should.deepEqual(['hello']);
    });

    it('should default groupByFieldsForStatistics to empty array', () => {
      const { groupByFieldsForStatistics } = StatisticsFields.normalizeOptions({});

      groupByFieldsForStatistics.should.deepEqual([]);
    });
  });

  describe('static create method', () => {
    it('should create fields from statistics and without definitions', () => {
      const result = StatisticsFields.create({
        statisticsSample: { foo: 1.234 },
      });
      result.should.deepEqual([
        {
          name: 'foo',
          type: 'esriFieldTypeDouble',
          sqlType: 'sqlTypeFloat',
          alias: 'foo',
          domain: null,
          defaultValue: null,
        },
      ]);
    });

    it('should create date field when value is ISO-string date', () => {
      const result = StatisticsFields.create({
        statisticsSample: { foo: new Date().toISOString() },
      });
      result.should.deepEqual([
        {
          name: 'foo',
          type: 'esriFieldTypeDate',
          sqlType: 'sqlTypeOther',
          alias: 'foo',
          domain: null,
          defaultValue: null,
        },
      ]);
    });

    it('should create date field when field is defined as date', () => {
      const result = StatisticsFields.create({
        statisticsSample: { foo: 100000 },
        fieldDefinitions: [{ name: 'foo', type: 'Date' }],
        outStatistics: [
          { onStatisticField: 'foo', outStatisticFieldName: 'foo', statisticType: 'max' },
        ],
      });
      result.should.deepEqual([
        {
          name: 'foo',
          type: 'esriFieldTypeDate',
          sqlType: 'sqlTypeOther',
          alias: 'foo',
          domain: null,
          defaultValue: null,
        },
      ]);
    });

    it('should create date field when field is defined as date, but custom label requested', () => {
      const result = StatisticsFields.create({
        statisticsSample: { bar: 100000 },
        fieldDefinitions: [{ name: 'foo', type: 'Date' }],
        outStatistics: [
          { onStatisticField: 'foo', outStatisticFieldName: 'bar', statisticType: 'max' },
        ],
      });
      result.should.deepEqual([
        {
          name: 'bar',
          type: 'esriFieldTypeDate',
          sqlType: 'sqlTypeOther',
          alias: 'bar',
          domain: null,
          defaultValue: null,
        },
      ]);
    });

    it('should create date field and groupBy fields', () => {
      const result = StatisticsFields.create({
        statisticsSample: { foo: 100000, bar: 'hello', walter: 1 },
        fieldDefinitions: [{ name: 'foo', type: 'Date' }],
        outStatistics: [
          { onStatisticField: 'foo', outStatisticFieldName: 'foo', statisticType: 'max' },
        ],
        groupByFieldsForStatistics: 'bar,walter',
      });
      result.should.deepEqual([
        {
          name: 'foo',
          type: 'esriFieldTypeDate',
          sqlType: 'sqlTypeOther',
          alias: 'foo',
          domain: null,
          defaultValue: null,
        },
        {
          name: 'bar',
          type: 'esriFieldTypeString',
          sqlType: 'sqlTypeOther',
          length: 128,
          alias: 'bar',
          domain: null,
          defaultValue: null,
        },
        {
          name: 'walter',
          type: 'esriFieldTypeInteger',
          sqlType: 'sqlTypeOther',
          alias: 'walter',
          domain: null,
          defaultValue: null,
        },
      ]);
    });
  });
});
