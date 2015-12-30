# Koop-Logger
* A shared logger for Koop

## Usage
`npm install koop-logger`
```javascript
const Logger = require('koop-logger')
const config = require('config')
const log = new Logger(config)

log.info('foo')
log.debug('bar')
log.error('baz')
log.warn('bing')
```
