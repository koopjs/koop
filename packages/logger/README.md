# Koop-Logger
![https://www.npmjs.com/package/@koopjs/logger](https://img.shields.io/npm/v/@koopjs/logger.svg?style=flat-square)
![coverage](https://raw.githubusercontent.com/koopjs/koop/master/packages/logger/coverage.svg)
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
