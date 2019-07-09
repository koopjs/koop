const should = require('should') // eslint-disable-line
const Model = require('../src/models/index')
Model.prototype.getData = function (req, callback) {
  callback(new Error('skipping getData for test'))
}
// A simple error that helps us bail out of code flow after we have tested what we want to test
const skipError = new Error('skip-error for test')

describe('Tests for models/index', function () {
  describe('Tests for createKey', function () {
    it('should create cache-key as provider name', () => {
      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: function (key, queryParams, callback) {
            // test for properly composed cache-key
            key.should.equal('test-provider')
            callback(skipError)
          }
        }
      })
      model.pull({ url: 'domain/test-provider', params: {} }, (err, data) => {
        err.message.should.equal('skipping getData for test')
      })
    })

    it('should create cache-key as provider name and concenated url params', () => {
      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: function (key, queryParams, callback) {
            // test for properly composed cache-key
            key.should.equal('test-provider::host-param::id-param::layer-param')
            callback(skipError)
          }
        }
      })
      model.pull({ url: 'domain/test-provider', params: { host: 'host-param', id: 'id-param', layer: 'layer-param' } }, (err, data) => {
        err.message.should.equal('skipping getData for test')
      })
    })

    it('should create cache-key from Model defined createKey function', () => {
      // create a model with mocked cache "retrieve" function
      const model = new Model({
        cache: {
          retrieve: function (key, queryParams, callback) {
            // test for properly composed cache-key
            key.should.equal('custom-key')
            callback(skipError)
          }
        }
      })
      model.createKey = function () { return 'custom-key' }
      model.pull({ url: 'domain/test-provider' }, (err, data) => {
        err.message.should.equal('skipping getData for test')
      })
    })
  })
})
