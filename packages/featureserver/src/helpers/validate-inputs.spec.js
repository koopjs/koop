const should = require('should') // eslint-disable-line
const sinon = require('sinon');
require('should-sinon');
const proxyquire = require('proxyquire');
const { validateInputs } = require('./validate-inputs');

describe('validateInputs', () => {
  describe('Validate geojson', () => {
    const hintSpy = sinon.spy(() => {
      return ['validatation error'];
    });

    const debugSpy = sinon.spy();

    it('should validate geojson when VALIDATE_GEOJSON is defined', () => {
      process.env.VALIDATE_GEOJSON = '';

      const { validateInputs } = proxyquire('./validate-inputs', {
        'geojson-validation': {
          valid: hintSpy
        },
        '../log-manager': {
          logger: {
            debug: debugSpy
          }
        }
      });

      validateInputs({}, { foo: 'geojson' });
      hintSpy.calledOnce.should.equal(true);
      hintSpy.firstCall.args.should.deepEqual([{ foo: 'geojson' }, true]);
      debugSpy.calledOnce.should.equal(true);
      delete process.env.VALIDATE_GEOJSON;
    });

    it('should skip geojson validation', () => {
      const { validateInputs } = proxyquire('./validate-inputs', {
        'geojson-validation': {
          valid: hintSpy
        },
        '../log-manager': {
          logger: {
            debug: debugSpy
          }
        }
      });
      validateInputs({}, { foo: 'geojson' });
      hintSpy.notCalled.should.equal(true);
    });

    afterEach(() => {
      debugSpy.resetHistory();
      hintSpy.resetHistory();
      process.env.LOG_LEVEL = undefined;
      process.env.KOOP_LOG_LEVEL = undefined;
    });
  });

  describe('Validate geojson metadata', () => {
    it('should validate geojson metadata and find no error', () => {
      try {
        validateInputs({}, { metadata: { maxRecordCount: 1 } });
      } catch (error) {
        throw new Error(`should not have thrown; ${error}`);
      }
    });

    it('should validate geojson metadata and find error', () => {
      try {
        validateInputs({}, { metadata: { maxRecordCount: '1' } });
        throw new Error('should have thrown');
      } catch (error) {
        error.code.should.equal(500);
      }
    });
  });

  describe('Validate request parameters', () => {
    it('should validate request parameters', () => {
      try {
        validateInputs({ foo: 'bar', resultRecordCount: 1 }, {});
      } catch (error) {
        throw new Error(`should not have thrown; ${error}`);
      }
    });

    it('should not validate request parameters', () => {
      try {
        validateInputs({ resultRecordCount: false }, {});
        throw new Error('should have thrown');
      } catch (error) {
        error.code.should.equal(400);
      }
    });
  });
});