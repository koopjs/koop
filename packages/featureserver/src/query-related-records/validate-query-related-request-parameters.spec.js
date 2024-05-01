const should = require('should'); // eslint-disable-line
const {
  validateQueryRelatedRequestParams,
} = require('./validate-query-related-request-parameters');

describe('validate-query-related-request-parameters', () => {
  describe('f', () => {
    it('should invalidate with 400 due to invalid f param', () => {
      try {
        validateQueryRelatedRequestParams({
          f: 'foo',
        });
      } catch (error) {
        error.message.should.deepEqual('Invalid format');
        error.details.should.deepEqual(['"f" must be one of [json, pjson]']);
        error.code.should.equal(400);
      }
    });

    it('should invalidate with 400 due to other error', () => {
      try {
        validateQueryRelatedRequestParams({
          outSR: 'foo',
        });
      } catch (error) {
        error.message.should.deepEqual('"outSR" must be one of [number, object]');
        error.details.should.deepEqual(['"outSR" must be one of [number, object]']);
        error.code.should.equal(400);
      }
    });

    it('should validate if missing (optional)', () => {
      try {
        validateQueryRelatedRequestParams({});
      } catch (err) {
        err.should.deepEqual(undefined);
      }
    });
  });
});
