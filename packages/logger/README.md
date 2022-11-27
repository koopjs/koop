# Koop-Logger

## Usage
`npm install @koopjs/logger`
```javascript
const Logger = require('@koopjs/logger')
const config = require('config')
const log = new Logger(config)

log.info('foo')
log.debug('bar')
log.error('baz')
log.warn('bing')
```
