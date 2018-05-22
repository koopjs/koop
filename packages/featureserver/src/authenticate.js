/**
 * Respond with an successful authentication response
 * @param {object} res express response object
 * @param {object} auth authentication result object
 * @param {string} auth.token encoded token
 * @param {integer} auth.expires token expiration time (epoch)
 * @param {boolean} ssl flag that indicates if token must always be passed back via HTTPS
 */
function authentication (res, auth, ssl = false) {
  auth.ssl = ssl
  res.status(200).json(auth)
}

module.exports = authentication
