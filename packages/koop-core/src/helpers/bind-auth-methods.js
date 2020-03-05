module.exports = function (params) {
  const {
    provider: {
      Model,
      namespace
    },
    auth: {
      authenticationSpecification,
      authenticate,
      authorize
    }
  } = params

  Model.prototype.authenticationSpecification = Object.assign({}, authenticationSpecification(namespace), { provider: namespace })
  Model.prototype.authenticate = authenticate
  Model.prototype.authorize = authorize
}
