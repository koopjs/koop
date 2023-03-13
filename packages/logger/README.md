# Koop-Logger
[![npm][npm-image]][npm-url]
![coverage](./coverage.svg)
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

[npm-img]: https://img.shields.io/npm/v/@koopjs/logger.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@koopjs/logger