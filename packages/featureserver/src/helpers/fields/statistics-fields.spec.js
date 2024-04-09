const should = require('should');
should.config.checkProtoEql = false;
const StatisticsFields = require('./statistics-fields');

describe('StatisticsFields', () => {
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
      const { groupByFieldsForStatistics } = StatisticsFields.normalizeOptions(
        {},
      );

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
        outStatistics: [{ onStatisticField: 'foo' }],
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
          { onStatisticField: 'foo', outStatisticFieldName: 'bar' },
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
        outStatistics: [{ onStatisticField: 'foo' }],
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
