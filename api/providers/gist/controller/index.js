
module.exports = {

  provider: true,
 
  index: function(req, res){
    res.view('gist/index');
  },

  find: function(req, res){
    function send( err, data ){
        var len = data.length;
        var allTopojson = [];
        var processTopojson = function( topology ){
          allTopojson.push(topology);
          if ( allTopojson.length == len ) {
            res.json( allTopojson );
          }
        };

        if ( err ){
          res.json( err, 500 );
        } else { 
          if ( data ){
            if (req.query.topojson ){
              var allData = {};
              data.forEach(function( d ){
                Topojson.convert(d, function(err, topology){
                  processTopojson( topology );
                });
                //allData[d.name] = d;
              });    
              //Topojson.convert(allData, function(err, topology){
               // res.json( topology );  
              //});
            } else { 
              res.json( data );
            }
          } else {
            res.send('There a problem accessing this gist', 500);
          }
        }
    };
    if ( req.params.id ){
      var id = req.params.id;
      var d = {};
      Gist.find( id, req.query, function( err, data) {
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
      res.send('Must specify a user and gist id', 404);
    }
  },

  featureservice: function(req, res){
    var callback = req.query.callback;
    delete req.query.callback;

    function send( err, data ){
      if ( err ){
        res.json( err, 500 );
      } else if ( data ){
        if ( FeatureServices[ req.params.layer ]){
          FeatureServices[ req.params.layer ]( data, req.query || {}, function( err, d ){
            if ( callback ){
              res.send( callback + '(' + JSON.stringify( d ) + ')' );
            } else {
              res.json( d );
            }
          });
        } else {
          // have a layer 
          if (req.params.layer && data[ req.params.layer ]){
            data = data[ req.params.layer ];
          } else if ( req.params.layer && !data[req.params.layer]){
            res.send('Layer not found', 404);
          }
 
          if ( req.params.method && FeatureServices[ req.params.method ] ){
            FeatureServices[ req.params.method ]( data, req.query || {}, function( err, d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
            });
          } else {
            FeatureServices.info( data, req.params.layer, req.query || {}, function( err, d ){
              if ( callback ){
                res.send( callback + '(' + JSON.stringify( d ) + ')' );
              } else {
                res.json( d );
              }
            });
          }
        }

      } else {
        res.send('There a problem accessing this gist', 500);
      }
    };

    if ( req.params.id ){
      var id = req.params.id;
      Gist.find( id, req.query, function( err, data) {
        send( err, data );
      });
    } else {
      res.send('Must specify a gist id', 404);
    }

  },

  preview: function(req, res){
    res.view('demo/gist', { locals:{ id: req.params.id } });
  }


};
