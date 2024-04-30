require('should');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { buildRenderer } = require('./build-renderer');

describe('build-renderer', () => {
  describe('empty result', () => {
    it('no classificationDef', () => {
      const data = {};
      const result = buildRenderer(data);
      result.should.deepEqual({});
    });
  });

  describe('with pre-calculated statistics', () => {
    it('should render precalculated statistics', () => {
      const getGeometrySpy = sinon.spy(function () {
        return 'esriGeometryPoint';
      });

      const createSymbolSpy = sinon.spy(function () {
        return 'symbol';
      });

      const createColorRampSpy = sinon.spy(function () {
        return ['color-1', 'color-2'];
      });

      const { buildRenderer } = proxyquire('./build-renderer', {
        '../helpers': {
          getGeometryTypeFromGeojson: getGeometrySpy,
        },
        './create-symbol': {
          createSymbol: createSymbolSpy,
        },
        './color-ramp': {
          createColorRamp: createColorRampSpy,
        },
      });

      const data = {
        statistics: {
          classBreaks: [
            [0, 10],
            [21, 30],
            [11, 20],
          ],
        },
      };
      const result = buildRenderer(data);

      result.should.deepEqual({
        type: 'classBreaks',
        field: '',
        classificationMethod: '',
        minValue: 0,
        classBreakInfos: [
          {
            classMinValue: 0,
            classMaxValue: 10,
            label: '0-10',
            description: '',
            symbol: 'symbol',
          },
          {
            classMinValue: 11,
            classMaxValue: 20,
            label: '11-20',
            description: '',
            symbol: 'symbol',
          },
          {
            classMinValue: 21,
            classMaxValue: 30,
            label: '21-30',
            description: '',
            symbol: undefined,
          },
        ],
      });

      getGeometrySpy.calledOnce.should.equal(true);
      getGeometrySpy.firstCall.args.should.deepEqual([data]);
      createColorRampSpy.calledOnce.should.equal(true);
      createColorRampSpy.firstCall.args.should.deepEqual([
        { classification: data.statistics.classBreaks },
      ]);
      createSymbolSpy.calledTwice.should.equal(true);
      createSymbolSpy.firstCall.args.should.deepEqual([undefined, 'color-1', 'esriGeometryPoint']);
      createSymbolSpy.secondCall.args.should.deepEqual([undefined, 'color-2', 'esriGeometryPoint']);
    });

    it('should render precalculated statistics with default geometry type', () => {
      const getGeometrySpy = sinon.spy(function () {});

      const createSymbolSpy = sinon.spy(function () {
        return 'symbol';
      });

      const createColorRampSpy = sinon.spy(function () {
        return ['color-1', 'color-2'];
      });

      const { buildRenderer } = proxyquire('./build-renderer', {
        '../helpers': {
          getGeometryTypeFromGeojson: getGeometrySpy,
        },
        './create-symbol': {
          createSymbol: createSymbolSpy,
        },
        './color-ramp': {
          createColorRamp: createColorRampSpy,
        },
      });

      const data = {
        statistics: {
          classBreaks: [
            [0, 10],
            [21, 30],
            [11, 20],
          ],
        },
      };
      const result = buildRenderer(data);

      result.should.deepEqual({
        type: 'classBreaks',
        field: '',
        classificationMethod: '',
        minValue: 0,
        classBreakInfos: [
          {
            classMinValue: 0,
            classMaxValue: 10,
            label: '0-10',
            description: '',
            symbol: 'symbol',
          },
          {
            classMinValue: 11,
            classMaxValue: 20,
            label: '11-20',
            description: '',
            symbol: 'symbol',
          },
          {
            classMinValue: 21,
            classMaxValue: 30,
            label: '21-30',
            description: '',
            symbol: undefined,
          },
        ],
      });

      getGeometrySpy.calledOnce.should.equal(true);
      getGeometrySpy.firstCall.args.should.deepEqual([data]);
      createColorRampSpy.calledOnce.should.equal(true);
      createColorRampSpy.firstCall.args.should.deepEqual([
        { classification: data.statistics.classBreaks },
      ]);
      createSymbolSpy.calledTwice.should.equal(true);
      createSymbolSpy.firstCall.args.should.deepEqual([undefined, 'color-1', 'esriGeometryPoint']);
      createSymbolSpy.secondCall.args.should.deepEqual([undefined, 'color-2', 'esriGeometryPoint']);
    });
  });

  describe('with winnow statistics', () => {
    it('should return empty object when no classification def sent', () => {
      const winnowSpy = sinon.spy(function () {
        return [
          [0, 10],
          [11, 20],
          [21, 30],
        ];
      });

      const getGeometrySpy = sinon.spy(function () {
        return 'esriGeometryPoint';
      });

      const { buildRenderer } = proxyquire('./build-renderer', {
        '@koopjs/winnow': {
          query: winnowSpy,
        },
        '../helpers': {
          getGeometryTypeFromGeojson: getGeometrySpy,
        },
        './validate-classification-definition': () => {
          throw new Error('invalid classification definition');
        },
      });

      const result = buildRenderer({ features: ['feature'] }, {});
      result.should.deepEqual({});
    });

    it('should calculate breaks and use classBreaksDef for renderer', () => {
      const winnowSpy = sinon.spy(function () {
        return [
          [0, 10],
          [11, 20],
          [21, 30],
        ];
      });

      const getGeometrySpy = sinon.spy(function () {
        return 'esriGeometryPoint';
      });

      const createSymbolSpy = sinon.spy(function () {
        return 'symbol';
      });

      const createColorRampSpy = sinon.spy(function () {
        return ['color-1', 'color-2'];
      });

      const { buildRenderer } = proxyquire('./build-renderer', {
        '@koopjs/winnow': {
          query: winnowSpy,
        },
        '../helpers': {
          getGeometryTypeFromGeojson: getGeometrySpy,
        },
        './color-ramp': {
          createColorRamp: createColorRampSpy,
        },
        './create-symbol': { createSymbol: createSymbolSpy },
      });

      const result = buildRenderer(
        { features: ['feature'] },
        {
          classificationDef: {
            type: 'classBreaksDef',
            classificationField: 'classification-field',
            classificationMethod: 'classification-method',
          },
        },
      );

      result.should.deepEqual({
        type: 'classBreaks',
        field: 'classification-field',
        classificationMethod: 'classification-method',
        minValue: 0,
        classBreakInfos: [
          {
            classMinValue: 0,
            classMaxValue: 10,
            label: '0-10',
            description: '',
            symbol: 'symbol',
          },
          {
            classMinValue: 11,
            classMaxValue: 20,
            label: '11-20',
            description: '',
            symbol: 'symbol',
          },
          {
            classMinValue: 21,
            classMaxValue: 30,
            label: '21-30',
            description: '',
            symbol: undefined,
          },
        ],
      });

      getGeometrySpy.calledOnce.should.equal(true);
      getGeometrySpy.firstCall.args.should.deepEqual([{ features: ['feature'] }]);
      winnowSpy.calledOnce.should.equal(true);
      winnowSpy.firstCall.args.should.deepEqual([
        { features: ['feature'] },
        {
          classificationDef: {
            type: 'classBreaksDef',
            classificationField: 'classification-field',
            classificationMethod: 'classification-method',
          },
          geometryType: 'esriGeometryPoint',
        },
      ]);
    });

    it('should calculate breaks and use uniqueValueDef for renderer', () => {
      const winnowSpy = sinon.spy(function () {
        return [
          {
            count: 80,
            Genus: 'MAGNOLIA',
          },
          {
            count: 77,
            Genus: 'QUERCUS',
          },
          {
            count: 24,
            Genus: 'JACARANDA',
          },
        ];
      });

      const getGeometrySpy = sinon.spy(function () {
        return 'esriGeometryPoint';
      });

      const createSymbolSpy = sinon.spy(function () {
        return 'symbol';
      });

      const createColorRampSpy = sinon.spy(function () {
        return ['color-1', 'color-2'];
      });

      const { buildRenderer } = proxyquire('./build-renderer', {
        '@koopjs/winnow': {
          query: winnowSpy,
        },
        '../helpers': {
          getGeometryTypeFromGeojson: getGeometrySpy,
        },
        './color-ramp': {
          createColorRamp: createColorRampSpy,
        },
        './create-symbol': { createSymbol: createSymbolSpy },
      });

      const result = buildRenderer(
        { features: ['feature'] },
        {
          classificationDef: {
            type: 'uniqueValueDef',
            uniqueValueFields: ['Genus'],
            fieldDelimiter: ',',
          },
        },
      );

      result.should.deepEqual({
        type: 'uniqueValue',
        field1: 'Genus',
        field2: '',
        field3: '',
        fieldDelimiter: ',',
        defaultSymbol: {},
        defaultLabel: '',
        uniqueValueInfos: [
          {
            value: 'MAGNOLIA',
            count: 80,
            label: 'MAGNOLIA',
            description: '',
            symbol: 'symbol',
          },
          {
            value: 'QUERCUS',
            count: 77,
            label: 'QUERCUS',
            description: '',
            symbol: 'symbol',
          },
          {
            value: 'JACARANDA',
            count: 24,
            label: 'JACARANDA',
            description: '',
            symbol: undefined,
          },
        ],
      });

      getGeometrySpy.calledOnce.should.equal(true);
      getGeometrySpy.firstCall.args.should.deepEqual([{ features: ['feature'] }]);
      winnowSpy.calledOnce.should.equal(true);
      winnowSpy.firstCall.args.should.deepEqual([
        { features: ['feature'] },
        {
          classificationDef: {
            type: 'uniqueValueDef',
            fieldDelimiter: ',',
            uniqueValueFields: ['Genus'],
          },
          geometryType: 'esriGeometryPoint',
        },
      ]);
    });
  });
});
