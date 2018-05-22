const authenticationErrorResponse = require('../templates/errors/credentials-invalid.json')
const authorizationErrorResponse = require('../templates/errors/unauthorized.json')

/**
 * Respond with a authorization error response
 * @param {object} res express.js response object
 */
function authorization (res) {
  res.status(200).json(authorizationErrorResponse)
}

/**
 * Respond with an authentication error response
 * @param {object} res express.js response object
 */
function authentication (res) {
  res.status(200).json(authenticationErrorResponse)
}

module.exports = { authorization, authentication }
