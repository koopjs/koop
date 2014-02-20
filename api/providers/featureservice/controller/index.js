var request = require('request');


exports.provider = true;

exports.proxy = function(req, res){
  /*function send( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else { 
        if ( data ){
          res.json( data );
        } else {
          res.send('There a problem accessing this overlay', 500);
        }
      }
  };
  if ( req.params.id ){
    var id = req.params.id;
    var d = {};
    FeatureServiceProxy.find( id, req.query, function( err, data) {
      if (req.params.layer !== undefined && data[req.params.layer]){
        //d = data[req.params.layer];
        send( err, data[req.params.layer] );
      } else if ( !req.params.layer ) {
        send( err, data );
      } else {
        send( 'Layer not found', null);
      }
    });
  } else {
  }*/
  if (!req.query || !req.query.url ){ 
    res.send('Must specifiy a url', 500);
  } else {
    // get featureservice data
    var url = req.query.url.replace('?','&');
    delete req.query.url;
    FeatureServiceProxy.proxy( url, req.query, function(err, json){
      if (err) {
        res.send(err, 500);
      } else {
        res.json( json );
      }
    });
  }
};

exports.thumbnail = function(req, res){
  if (!req.query || !req.query.url ){ 
    res.send('Must specifiy a url', 500);
  } else {
    var url = req.query.url.replace('?','&');
    delete req.query.url;
    FeatureServiceProxy.thumbnail( url, req.query, function(err, file){
      if (err) {
        res.send(err, 500);
      } else {
        console.log('send file', file);
        res.sendfile( file );
      }
    });
  }
};

