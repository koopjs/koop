const restInfoTemplate = require('../templates/rest-info.json')
const versionTemplate = require('../templates/version.json')

function restInfo (dataSourceRestInfo) {
  return { ...restInfoTemplate, ...versionTemplate, ...dataSourceRestInfo }
}

module.exports = restInfo
