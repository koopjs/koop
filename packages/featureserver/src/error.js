const authenticationErrorResponse = {
  error: {
    code: 400,
    message: 'Unable to generate token.',
    details: ['Invalid username or password.'],
  },
};
const authorizationErrorResponse = {
  error: {
    code: 499,
    message: 'Token Required',
    details: [],
  },
};

const responseHandler = require('./response-handler');

/**
 * Respond with a authorization error response
 * @param {object} res express.js response object
 */
function authorization(req, res) {
  responseHandler(req, res, 200, authorizationErrorResponse);
}

/**
 * Respond with an authentication error response
 * @param {object} res express.js response object
 */
function authentication(req, res) {
  responseHandler(req, res, 200, authenticationErrorResponse);
}

module.exports = { authorization, authentication };
