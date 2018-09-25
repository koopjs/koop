
function fakeAuth () {
  return {
    type: 'auth',
    authenticationSpecification: function () {
      return function () { }
    },
    authenticate: function () {},
    authorize: function () {}
  }
}

module.exports = fakeAuth
