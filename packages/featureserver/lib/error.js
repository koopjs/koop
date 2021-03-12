const authenticationErrorResponse = require('../templates/errors/credentials-invalid.json')
const authorizationErrorResponse = require('../templates/errors/unauthorized.json')
const responseHandler = require('./response-handler')

/**
 * Respond with a authorization error response
 * @param {object} res express.js response object
 */
function authorization (req, res) {
  responseHandler(req, res, 200, authorizationErrorResponse)
}

/**
 * Respond with an authentication error response
 * @param {object} res express.js response object
 */
function authentication (req, res) {
  responseHandler(req, res, 200, authenticationErrorResponse)
}

module.exports = { authorization, authentication }
