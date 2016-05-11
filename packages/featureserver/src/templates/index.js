const fields = require('../fields.js')

module.exports = { render }

const templates = {
  server: require('./server.json'),
  layer: require('./layer.json'),
  service: require('./server.json'),
  features: require('./features.json'),
  statistics: require('./statistics.json')
}

/**
 * loads a template json file and attaches fields
 *
 * @param {string} tmpl
 * @param {object} data
 * @return {object} template
 */
function render (template, data, options) {
  const json = templates[template]
  if (!json) throw new Error('Unsupported operation')

  if (!template.match(/serv/) && data && data.features && data.features.length) {
    const props = data.features[0].properties || data.features[0].attributes
    const fieldObj = fields(props, template, options)
    json.features = data.features
    json.fields = fieldObj.fields
  }
  return json
}
