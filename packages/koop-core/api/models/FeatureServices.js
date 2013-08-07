/*---------------------
	:: Services
	-> model
---------------------*/
var terraformer = require('terraformer');
var terraformerParser = require('terraformer-arcgis-parser');

module.exports = {

	attributes: {
	},

  fieldTypes: {
    'string': 'esriFieldTypeString',
    'integer': 'esriFieldTypeInteger',
    'date': 'esriFieldTypeDate',
    'datetime': 'esriFieldTypeDate',
    'float': 'esriFieldTypeDouble'
  },

  fieldType: function( value ){
    var type = typeof( value );
    if ( type == 'number'){
      type = ( this.isInt( value ) ) ? 'integer' : 'float';
    }
    return this.fieldTypes[ type ];
  },

  // is the value an integer?
  isInt: function( v ){
    return Math.round( v ) == v;
  },

  fields: function( props, idField ){
    var self = this;
    var fields = [];
    Object.keys( props ).forEach(function( key ){
      var type = ( idField && key == idField ) ? 'esriFieldTypeOID' : self.fieldType( props[ key ] );
      fields.push({
        name: key,
        type: type,
        alias: key
      });
    });

    if ( !idField ){
      fields.push({
        name: 'id',
        type: 'esriFieldTypeOID',
        alias: 'id'
      });
    }
    return fields;
  },

  process: function( tmpl, data, params ){
    var template = require(__dirname + tmpl);
    template.fields = this.fields( data.features[0].properties, params.idField );
    return template;
  },

  info: function( data, layer, params, callback ){
    if ( layer !== undefined ) {
      // send the layer json
      var json = this.process('/../templates/featureLayer.json', data, params );
    } else {
      // no layer, send the service json
      var json = this.process('/../templates/featureService.json', data, params);
      json.layers[0] = {
        id: 0,
        name: "layer1",
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 99999.99,
        maxScale: 0
      };
    }
    //if ( callback ) callback( json ); 
    this.send( json, params, callback );
  },

  query: function( data, params, callback ){
    var self = this;
    if ( params.objectIds ) {
      this.queryIds( data, params, function( json ){ 
        self.send( json, params, callback );
      });
    } else { 
      var json = this.process('/../templates/featureSet.json', data, params );
      json.features = terraformerParser.convert( data );
      if ( !params.idField ) {
        json.features.forEach(function( f, i ){
          if ( !f.attributes.id ){
            f.attributes.id = i+1;
          }
        });
      }
      this.send( json, params, callback );
    }
  },

  queryIds: function( data, params, callback ){
    var json = this.process('/../templates/featureSet.json', data, params );
    var allFeatures = terraformerParser.convert( data ),
      features = [];
    allFeatures.forEach(function( f, i ){
      var id;
      if ( !params.idField ){
        // Assign a new id, create an 'id'
        id = i+1;
        if ( !f.attributes.id ){
          f.attributes.id = id;
        }
      } else {
        id = f.attributes[ params.idField ];
      }
      if ( params.objectIds.indexOf( id ) > -1 ){
        features.push( f );
      }
    });
    json.features = features;
    if ( callback ) callback( json );
  },

  // subset the features by geometry
  // TODO support more that points 
  geometryFilter: function(json, params, callback){

    // TODO put this in a function and pass params use relationParam and spatialRel (esriSpatialRelContains)
    // return an object the geometry and type and spatialRel 
    //========================================================================================================
    // Parse the geometry
    if ( typeof( params.geometry ) == 'object' ) {
      //var geom = JSON.parse( params.geometry );
      var geom = params.geometry;
      // TODO check the spatial ref for 102100 and convert each coord to 4326
      geom = [ geom.minx, geom.miny, geom.maxx, geom.maxy ];
    } else {
      var geom = params.geometry.split(',').map(function(v){ return parseFloat(v); });
    }
    delete params.geometry;

    var geometryType = params.geometryType || "esriGeometryEnvelope"; 
      delete params.geometryType;

    var spatialRel = params.spatialRel || 'esriSpatialRelContains';
    var box = new terraformer.Polygon([ 
        [ [ geom[0], geom[1] ], [ geom[0], geom[3] ], [ geom[2], geom[3] ], [  geom[2], geom[1] ] ] 
    ]);
    //========================================================================================================

    if ( spatialRel == 'esriSpatialRelContains' ) {
      var filteredFeatures = [];
      json.features.forEach(function( f ){
        // TODO check feature TYPE 
        var featureGeom;
        if ( !f.geometry.type || f.geometry.type == 'Point' ){
          featureGeom = new terraformer.Point([ f.geometry.x, f.geometry.y ]);
        } else if ( f.geometry.type == 'Polygon' ){
          featureGeom = new terraformer.Polygon([ f.geometry.rings ]);
        }
        if (box.contains( featureGeom )) { 
          filteredFeatures.push( f );
        }
      });
      json.features = filteredFeatures;
    }
    this.send( json, params, callback );
  },

  // process the where filter in the params 
  // TODO actually support parsing where clauses 
  whereFilter: function( json, params, callback ){
    var where = params.where;
      delete params.where; 
    this.send( json, params, callback );
  },

  // filter the data based on any given query params 
  send: function(json, params, callback){
    if ( params.geometry ){
      this.geometryFilter( json, params, callback );
    } else if ( params.where ){
      this.whereFilter( json, params, callback );
    } else {
      if ( params.returnCountOnly ){
        json = { count: json.features.length };
      } else if ( params.returnIdsOnly ){
        var objectIds = [];
        json.features.forEach(function(f){
          objectIds.push( f.attributes[ params.idField || 'id' ] );
        });
        json = {
          objectIdField: params.idField || 'id',
          objectIds: objectIds
        };
      }

      if ( params.returnGeometry == 'false' && (!params.outFields || params.outFields != '*')){
        json.features.forEach(function(f){
          delete f.geometry;
        });
      } else if ( params.outSR && ( params.outSR == '102100' ) ){
        json.features.forEach( function( f ){
          // create NEW terraformer POINT
          // update the geometry on the feature      
          f.geometry = new terraformer.Point( [f.geometry.x, f.geometry.y] ).toMercator();
        });
      }

      // checkout for outfields 
      if ( params.outFields && params.outFields != '*' ){
        var features = [],
          outFields = params.outFields.split( ',' );

        json.features.forEach( function( f ){
          var newFeature = { geometry: f.geometry, attribute: {} };
          outFields.forEach( function( field ){
            newFeature.attributes[ field ] = f.attributes[ field ];
          });
          features.push( newFeature );
        });
        json.features = features;
      }

      callback( json );
    }
  }

};
