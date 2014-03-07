module.exports = {
  list: function( req, res ){
    var providers = []; 
    _.each(sails.middleware.controllers, function( c, name ){
      if (c.provider) { 
        providers.push( name);
      }
    });
    res.json( providers );
  },

  info: function( req, res ){
    var info = {
      "currentVersion": 10.0,
      "fullVersion": "10.0",
      "authInfo": {
        "isTokenBasedSecurity": false
      }
    }
    res.json(info);
  } 
};
