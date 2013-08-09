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

  // load a template json file and attach fields
  process: function( tmpl, data, params ){
    var template = require(__dirname + tmpl);
    template.fields = this.fields( data.features[0].properties, params.idField );
    return template;
  },

  // returns the feature service metadata (/FeatureServere and /FeatureServer/0)
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
    this.send( json, params, callback );
  },

  // processes params based on query params 
  query: function( data, params, callback ){
    //console.log(params);
    var self = this;
    if ( params.objectIds ) {
      this.queryIds( data, params, function( json ){ 
        self.send( json, params, callback );
      });
    } else { 
      var json = this.process('/../templates/featureSet.json', data, params );
      // geojson to esri json
      json.features = terraformerParser.convert( data );
      
      if ( json.features[0].geometry.rings ) { 
        json.geometryType = 'esriGeometryPolygon';
      } else if ( json.features[0].geometry.paths ){
        json.geometryType = 'esriGeometryPolyline';
      }

      // create an id field if not existing 
      if ( !params.idField ) {
        json.features.forEach(function( f, i ){
          if ( !f.attributes.id ){
            f.attributes.id = i+1;
          }
        });
      }
      // send back to controller 
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

  // filter the data based on any given query params 
  send: function(json, params, callback){
    Query.filter( json, params, callback );
  }

};
