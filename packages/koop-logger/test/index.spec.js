const test = require('tape')
const koopLogger = require('../')

test('koop-logger', spec => {
  try {
    const log = new koopLogger()
    spec.ok(log)
    spec.equals(typeof log.warn, 'function')
    spec.equals(typeof log.debug, 'function')
    spec.equals(typeof log.info, 'function')
    spec.equals(typeof log.verbose, 'function')
    spec.equals(typeof log.error, 'function')
  } catch (err) {
    spec.fail(err)
  }
  spec.end()
})