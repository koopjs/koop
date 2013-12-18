module.exports = {
  list: function( req, res ){
    var providers = []; 
    _.each(sails.middleware.controllers, function( c, name ){
      if (c.provider) { 
        providers.push( name);
      }
    });
    res.json( providers );
  } 
};
