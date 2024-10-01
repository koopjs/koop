
const packageInfo = require('../package.json')
const koopConfig = require('../koop.json')

const provider = {
  type: 'provider',
  version: packageInfo.version,
  name: koopConfig.name,
  hosts: koopConfig.allowedParams.host,
  disableIdParam: !koopConfig.allowedParams.id,
  Model: require('./model')
}

module.exports = provider
