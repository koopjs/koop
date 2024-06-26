const should = require('should'); // eslint-disable-line
const { validateQueryRequestParams } = require('./validate-query-request-parameters');

describe('validate-query-request-parameters', () => {
  describe('quantizationParameters', () => {
    it('should invalidate with 400 due to missing extent param', () => {
      try {
        validateQueryRequestParams({
          quantizationParameters: {
            extent: {},
          },
        });
      } catch (error) {
        error.message.should.deepEqual("'quantizationParameters' parameter is invalid");
        error.details.should.deepEqual(['"quantizationParameters.extent.xmin" is required']);
        error.code.should.equal(400);
      }
    });

    it('should validate if missing (optional)', () => {
      try {
        validateQueryRequestParams({});
      } catch (err) {
        err.should.deepEqual(undefined);
      }
    });
  });

  describe('f', () => {
    it('should invalidate with 400 due to invalid f param', () => {
      try {
        validateQueryRequestParams({
          f: 'foo',
        });
      } catch (error) {
        error.message.should.deepEqual('Invalid format');
        error.details.should.deepEqual(['"f" must be one of [json, pjson, pbf, geojson]']);
        error.code.should.equal(400);
      }
    });

    it('should validate if missing (optional)', () => {
      try {
        validateQueryRequestParams({});
      } catch (err) {
        err.should.deepEqual(undefined);
      }
    });
  });
});
