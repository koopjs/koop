
function fakeAuth () {

  return {
    type: 'auth',
    getAuthenticationSpecification: function () {
      return function () { }
    },
    authenticate: function () {},
    authorize: function () {}
  }
}


module.exports = fakeAuth
