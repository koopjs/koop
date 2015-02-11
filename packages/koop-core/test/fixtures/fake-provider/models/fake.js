
function Fake( koop ){

  var fake = {};

  fake.__proto__ = koop.BaseModel( koop );

  fake.find = function find( id, options, callback ){
    callback( null, [{}] );
  };
  
  return fake;
};


module.exports = Fake;
