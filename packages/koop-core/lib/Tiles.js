var mapnik = require('mapnik'),  
  mapnikPool = require('mapnik-pool')(mapnik),
  mercator = new(require('sphericalmercator'))(),
  nfs = require('node-fs'),
  zlib = require('zlib'),
  request = require('request'),
  path = require('path'),
  fs = require('fs');

mapnik.register_default_input_plugins();

// register geojson as a datasource in mapnik
mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins,'geojson.input'));

// create a space to hold pools of maps for repeat referencing
mapnik.pools = {};

var Tiles = function( koop ){

  this.mapnikHeader = '<Map srs="+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over" background-color="transparent" buffer-size="20"><Style name="polygon" filter-mode="first"><Rule><PolygonSymbolizer fill="darkblue" fill-opacity=".75"/></Rule></Style><Style name="point"><Rule><MarkersSymbolizer fill="#55AADD" opacity=".75" width="10.5" stroke="white" stroke-width="2" stroke-opacity=".25" placement="point" marker-type="ellipse" allow-overlap="true"/></Rule></Style><Style name="linestring">  <Rule><LineSymbolizer stroke="darkgrey" stroke-width="3" /><LineSymbolizer stroke="white" stroke-width="1.5" /></Rule></Style><Style name="multilinestring"><Rule><LineSymbolizer stroke="darkgrey" stroke-width="3" /><LineSymbolizer stroke="white" stroke-width="1.5" /></Rule></Style><Style name="multipolygon" filter-mode="first"><Rule><PolygonSymbolizer fill="darkblue" fill-opacity=".75"/></Rule></Style>';

  this.mapnikFooter = '</Map>';

  this.buildTableQuery = function( table, fields ){
    var select = "(Select geom, ";
    var list = [];
    fields.forEach(function(field, i){
      list.push("feature->'properties'->>'"+field.name+"' as "+field.name);
    });
    select += list.join(',');
    select += ' from "'+table+'") as foo';
    return select;
  };

  this.mapnikLayer = function( table, layerObj ){
    var name = layerObj.name,
      maxZoom = layerObj.maxScale,
      minZoom = layerObj.minScale,
      type = layerObj.geometryType,
      fields = layerObj.fields;

    tableQuery = this.buildTableQuery( table, fields);

    var layer = '<Layer name="'+name+'" maxzoom="'+minZoom+'" minzoom="'+maxZoom+'" buffer-size="20" status="on" srs="+proj=latlong +datum=WGS84">';
    layer += '<StyleName>' + type + '</StyleName>';
    layer += '<Datasource><Parameter name="type">postgis</Parameter>';
    layer += '<Parameter name="host">'+Cache.db.client.host+'</Parameter>';
    layer += '<Parameter name="dbname">'+Cache.db.client.database+'</Parameter>';
    layer += '<Parameter name="user">'+Cache.db.client.user+'</Parameter>';
    layer += '<Parameter name="password">'+(Cache.db.client.password || '')+'</Parameter>';
    layer += '<Parameter name="table">'+tableQuery+'</Parameter>';
    layer += '<Parameter name="geometry_field">geom</Parameter></Datasource></Layer>';

    return layer;
  };

  this.createMapnikStyleSheet = function(file, data, params, callback){
    var self = this;
    var styleSheet = this.mapnikHeader, table;
    var layers = [];

    if (data && data.layerInfo){
      var i = data.layerInfo.length - 1;
      while ( i >= 0 ) {
        layer = data.layerInfo[i];
        table = [params.type, params.item, layer.id].join(':');
        layers.push( self.mapnikLayer( table, layer ) );
        i--;
      } 
    } else if ( data.layers ){
      data.layers.forEach(function(layer){
        var lyr = '<Layer name="'+layer.name+'" buffer-size="20" status="on" srs="+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"><StyleName>'+layer.style+'</StyleName> <Datasource> <Parameter name="file">'+layer.file+'</Parameter> <Parameter name="layer">OGRGeoJSON</Parameter> <Parameter name="type">ogr</Parameter></Datasource></Layer>';
        layers.push(lyr);
      });
    }
   
    styleSheet += layers.join('');
    styleSheet += this.mapnikFooter;
    fs.writeFile(file, styleSheet, function(err){
      callback( null, file, styleSheet);
    });
  };

  this.getServiceTile = function( params, info, callback){
    var self = this;
    // check for the mapnik config
    var p = [ koop.files.localDir, 'tiles', params.key].join('/');
    var file = p + '/style.xml';
    nfs.mkdir( p, '0777', true, function(){
      if ( !nfs.existsSync( file ) ) {
        self.createMapnikStyleSheet(file, info, params, function(err, done){
          self.createServiceTile( params, file, function( err, tileFile ){
            callback( err, tileFile );
          });
        });
      } else {
        self.createServiceTile( params, file, function( err, tileFile ){
          callback( err, tileFile );
        });
      }
    });
 
  };

  this.createServiceTile = function(params, stylesheet, callback){
    var path = [ 
      koop.files.localDir + '/tiles', 
      params.key, 
      params.format, 
      params.z, 
      params.x
    ].join('/');

    var file = path + '/' + params.y + '.' + params.format;
    var size = params.size || 256;
    var mapKey = params.key +':'+ size; 

    nfs.mkdir( path, '0777', true, function(){
      if ( !fs.existsSync( file ) ) {
        if ( !mapnik.pools[ mapKey ] ){
          mapnik.pools[ mapKey ] = mapnikPool.fromString( fs.readFileSync( stylesheet, 'utf8' ), { 
            size: size,
            bufferSize: 20
          });
        }

        mapnik.pools[ mapKey ].acquire(function(err, map) {
          // pooled map extents
          //map = new mapnik.Map(256, 256);
          //map.loadSync( stylesheet );
          map.extent = mercator.bbox(params.x, params.y, params.z, false, '900913');

          if ( params.format == 'png' ){
    
            var image = new mapnik.Image(size, size);
    
            map.render( image, {}, function( err, im ) {
              if (err) {
                callback( err, null );
                mapnik.pools[ mapKey ].release( map );  
              } else {
                im.encode( 'png', function( err, buffer ) {
                  fs.writeFile( file, buffer, function( err ) {
                    mapnik.pools[ mapKey ].release( map );  
                    callback( null, file );
                  });
                });
              }
            });
  
          } else if ( params.format == 'pbf' ){

            var vtile = new mapnik.VectorTile( parseInt(params.z), parseInt(params.x), parseInt(params.y) );
            map.render( vtile, {}, function( err, vtile ) {
              if (err) {
                callback( err, null );
                mapnik.pools[ mapKey ].release( map );  
              } else {
                fs.writeFile( file, vtile.getData(), function(){
                  mapnik.pools[ mapKey ].release( map );  
                  callback( null, file );
                });
              }
            });
          }

        });

      } else {
        callback( null, file );
      }
    });

  };

  this.get = function(params, data, callback ){
    var x = parseInt( params.x ),
      y = parseInt( params.y ),
      z = parseInt( params.z ),
      key = params.key,
      format = params.format;

    var options = {
      name: params.name
    };

    var style = params.style;

    if (!params.x || !params.y || !params.z || !format || !key){
      callback('Missing parameters', null);
    } else {
      // check the cache - the local file system 
      this._check( x, y, z, key, format, data, options, function( err, file ){
        if ( file ){
          if ( format == 'json' ){
            callback( err, file );
          } else {
            callback( err, file );
          }
        } else {
          callback( 'Something went wrong with the tiles', null );
        }
      });
    }

  };

  this._check = function( x, y, z, key, format, data, options, callback ){
    var self = this;
    var p = [ koop.files.localDir + 'tiles', key, format, z, x].join('/');
    var file = p + '/' + y + '.' + format;
    nfs.mkdir( p, '0777', true, function(){
      if ( !nfs.existsSync( file ) ) {
        options.key = key + [z,x,y].join(':');
        options.size = 256;

        // check for the config, create it if we need too
        // check for the mapnik config
        var p = [ koop.files.localDir, 'tiles', key].join('/');
        var styleFile = p + '/style.xml';
        options.styleFile = styleFile;
        nfs.mkdir( p, '0777', true, function(){
          //if ( !nfs.existsSync( styleFile ) ) {
            var info = {layers:[{
              name: options.name || 'tile',
              style: (data && data.features && data.features[0] ) ? data.features[0].geometry.type.toLowerCase() : 'polygon',
              file: file.replace(/png|utf|pbf|vector\.pbf/g, 'json')
            }]}; 
            self.createMapnikStyleSheet(styleFile, info, {}, function(err, done, raw){
              options.rawStyleSheet = raw;
              self._stash( file, format, data, z, x, y, options, function( err, newfile ){
                callback( err, newfile );
              });
            });
          //} else {
          //  self._stash( file, format, data, z, x, y, options, function( err, newfile ){
          //    callback( err, newfile );
          //  });
          //}
        });
      } else {
        callback( null, file );
      }
    });
  };

  this._stash = function( file, format, geojson, z, x, y, opts, callback ){
      var feature;
      if ( format == 'json' ){
        delete geojson.info;
        delete geojson.name;
        geojson.type = 'FeatureCollection';
        fs.writeFile( file, JSON.stringify( geojson ), function(){
          callback( null, file );
        });
      } else {

          var render = function(){
            var layer;

              map = new mapnik.Map(256, 256);
              map.fromStringSync( opts.rawStyleSheet );
              map.extent = mercator.bbox(x, y, z, false, '900913');

              if ( format == 'png' ){
                var image = new mapnik.Image(256, 256);

                map.render( image, {}, function( err, im ) {
                  if (err) {
                    callback( err, null );
                  } else {
                    im.encode( 'png', function( err, buffer ) {
                      fs.writeFile( file, buffer, function( err ) {
                        callback( null, file );
                      });
                    });
                  }
                });
                
              } else if (format == 'vector.pbf' || format == 'pbf') {

                var vtile = new mapnik.VectorTile( z, x, y );

                map.render( vtile, {}, function( err, vtile ) {
                  if (err) {
                    callback( err, null );
                  } else {
                    zlib.deflate(vtile.getData(), function(err, buffer) {
                      fs.writeFileSync( file, buffer );
                      callback( null, file );
                    });
                  }
                });
  
              } else if ( format == 'utf') {
                var grid = new mapnik.Grid(256, 256, {key: '__id__'});
                map.render( grid, options, function( err, g ) {
                  if (err) {
                    callback( err, null );
                  } else {
                      var utf = g.encodeSync('utf', {resolution: 4});
                      fs.writeFile( file, JSON.stringify(utf), function( err ) {
                        callback( null, file );
                      });
                  }
                });

              }
          };

          var jsonFile = file.replace(/png|utf|pbf|vector\.pbf/g, 'json');

          if ( !nfs.existsSync( jsonFile ) ) {

            var dir = jsonFile.split('/');
            var f = dir.pop();

            nfs.mkdir( dir.join('/'), '0777', true, function(){
              delete geojson.info;
              delete geojson.name;
              geojson.type = 'FeatureCollection';
              fs.writeFile( jsonFile, JSON.stringify( geojson ), function(){
                render();
              });
            });

          } else if ( format == 'utf' && nfs.existsSync( file )){
    
            fs.readFile(file, function(err, data){
              callback(null, JSON.parse(data));  
            });

          } else {
            render();
          }

      }
  };

  this.getImageServiceTile = function(params, callback ){
    var x = parseInt( params.x ),
      y = parseInt( params.y ),
      z = parseInt( params.z ),
      key = params.item,
      format = params.format;

    if (!params.x || !params.y || !params.z || !format || !key){
      callback('Missing parameters', null);
    } else {
      // check the cache - the local file system 
      var self = this;
      var path = [ koop.files.localDir, 'tiles', key, format, z, x].join('/');
      var file = path + '/' + y + '.' + format;
      var bbox = mercator.bbox(x, y, z, false, '900913');
      nfs.mkdir( path, '0777', true, function(){
        if ( !nfs.existsSync( file ) ) {
          // make request for the tile
          var url = 'http://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/exportImage?f=image&bandIds=&renderingRule=%7B%22rasterFunction%22%3A%22Multi-Directional_Hillshade%22%7D&bbox=';
          url += bbox.join(',');
          url += '&bboxSR=102100&size=256%2C256';
          url += '&token=4DWehIBk9goi63goD845VtPE_DIgFuhGGAEeUbusRLq0mI2cMeguxP-kcn7HjrycSqR4oUPtw7sFHq6Veretac98rW0o63jI3L5hlqnp0a4IXq_lD9MhQn1kl7I3tfdydywq5_4zCC5fYgbqQ2b86M-DA5Mj1tNCv8bYFVCbfsGlyIvPPLwPnrzzkO5HdQo3lyHx367tdltqgVpNFX-riyXVFEzM4B8kFKN_52mCy7PWbXb_53xOcQ7viTvzweXJ';
          request.head(url, function(err, res, body){
            request(url).pipe(fs.createWriteStream(file)).on('close', function(){
              callback(null, file);
            });
          });
        } else {
          callback( null, file );
        }
      });
    }

  };

  return this;

};

module.exports = Tiles;
