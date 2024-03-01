const should = require('should'); // eslint-disable-line
const { validate } = require('./validate-query-request-parameters');

describe('validate-query-request-parameters', () => {
  describe('quantizationParameters', () => {
    it('should invalidate with 400 due to missing extent param', () => {
      try {
        validate({
          quantizationParameters: {
            extent: {},
          },
        });
      } catch (error) {
        error.message.should.deepEqual(
          '\'quantizationParameters\' parameter is invalid',
        );
        error.details.should.deepEqual([
          '"quantizationParameters.extent.xmin" is required'
        ]);
        error.code.should.equal(400);
      }
    });

    it('should validate if missing (optional)', () => {
      try {
        validate({});
      } catch (err) {
        err.should.deepEqual(undefined);
      }
    });
  });
});
