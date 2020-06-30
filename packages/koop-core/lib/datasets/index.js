const provider = {
  type: 'provider',
  name: 'datasets',
  hosts: false,
  Model: require('./model'),
  routes: require('./routes'),
  Controller: require('./controller')
}

module.exports = provider
