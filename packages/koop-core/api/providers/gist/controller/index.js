var extend = require('node.extend'),
  fs = require('fs'),
  base = require('../../base/controller.js');


var Controller = extend({

  index: function(req, res){
    res.view('gist/index');
  },

  find: function(req, res){
    var _send = function( err, data ){
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
          } else if ( req.params.format ) {
            var key = ['gist', req.params.id ].join(':');
            var fileName = [sails.config.data_dir + 'files', key, key + '.' + req.params.format].join('/');

            if (fs.existsSync( fileName )){
              res.sendfile( fileName );
            } else {
              Exporter.exportToFormat( req.params.format, key, data[0], function(err, file){
                if (err){
                  res.send(err, 500);
                } else {
                  res.sendfile( file );
                }
              });
            }
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
          _send( err, data[req.params.layer] );
        } else if ( !req.params.layer ) {
          _send( err, data );
        } else {
          _send( 'Layer not found', null);
        }
      });
    } else {
      res.send('Must specify a user and gist id', 404);
    }
  },

  featureservice: function(req, res){
    var callback = req.query.callback;
    delete req.query.callback;

    if ( req.params.id ){
      var id = req.params.id;
      Gist.find( id, req.query, function( err, data) {
        Controller._processFeatureServer( req, res, err, data, callback);
      });
    } else {
      res.send('Must specify a gist id', 404);
    }

  },

  preview: function(req, res){
    res.view('demo/gist', { locals:{ id: req.params.id } });
  }

}, base);

module.exports = Controller;
