# Koop-Logger

[![Greenkeeper badge](https://badges.greenkeeper.io/koopjs/koop-logger.svg)](https://greenkeeper.io/)
* A shared logger for Koop

[![Build Status](https://travis-ci.org/koopjs/koop-logger.svg?branch=master)](https://travis-ci.org/koopjs/koop-logger)

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
