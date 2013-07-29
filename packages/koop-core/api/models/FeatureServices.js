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

  fields: function( props ){
    var self = this;
    var hasId = false;
    var fields = [];
    Object.keys( props ).forEach(function( key ){
      fields.push({
        name: key,
        type: self.fieldType( props[ key ] ),
        alias: key
      });
      if ( key == 'id') hasId = true;
    });
    if ( !hasId ){
       fields.push({
        name: 'id',
        type: 'esriiFieldTypeOID',
        alias: 'id'
      });
    }
    return fields;
  },

  process: function( tmpl, data ){
    var template = require(__dirname + tmpl);
    template.fields = this.fields( data.features[0].properties );
    return template;
  },

  info: function( data, layer, callback ){
    var json;
    if ( layer !== undefined ) {
      // send the layer json
      json = this.process('/../templates/featureLayer.json', data );
    } else {
      // no layer, send the service json
      json = this.process('/../templates/featureService.json', data );
      json.layers.push({
        id: 0,
        name: "layer1",
        parentLayerId: -1,
        defaultVisibility: true,
        subLayerIds: null,
        minScale: 99999.99998945338,
        maxScale: 0
      });
      
    } 
    if ( callback ) callback( json );
  },

  query: function( data, params, callback ){
    var self = this;
    if ( params.objectIds ) {
      this.queryIds( data, params.objectIds, function( json ){ 
        self.send( json, params, callback );
      });
    } else { 
      var json = this.process('/../templates/featureSet.json', data );
      json.features = terraformerParser.convert( data );
      json.features.forEach(function( f, i ){
        if ( !f.attributes.id ){
          f.attributes.id = i+1;
        }
      });
      this.send( json, params, callback );
    }
  },

  queryIds: function( data, ids, callback ){
    var json = this.process('/../templates/featureSet.json', data );
    var allFeatures = terraformerParser.convert( data ),
      features = [];
    allFeatures.forEach(function( f, i ){
      var id = i+1;
      if ( !f.attributes.id ){
        f.attributes.id = id;
      }
      if ( ids.indexOf( id ) > -1 ){
        features.push( f );
      }
    });
    json.features = features;
    if ( callback ) callback( json );
  },

  // subset the features by geometry
  // TODO support more that points 
  geometryFilter: function(json, params, callback){
    console.log('FEATURES', json.features.length);
    var geom = params.geometry.split(',').map(function(v){ return parseFloat(v); });
      delete params.geometry;
    var geometryType = params.geometryType || "esriGeometryEnvelope"; 
      delete params.geometryType;

    if ( geometryType == 'esriGeometryEnvelope'){
      var box = new terraformer.Polygon([ 
        [ [ geom[0], geom[1] ], [ geom[0], geom[3] ], [ geom[2], geom[3] ], [  geom[2], geom[1] ] ] 
      ]);
      var filteredFeatures = [];
      json.features.forEach(function( f ){
        var point = new terraformer.Point([ f.geometry.x, f.geometry.y ]);
        if (box.contains(point)) filteredFeatures.push(f);
      });
      json.features = filteredFeatures;
    }
      
    this.send( json, params, callback );
  },

  // filter the data based on any given query params 
  send: function(json, params, callback){
    if ( params.geometry ){
      this.geometryFilter( json, params, callback );
    } else {
      if ( params.returnCountOnly ){
        json = { count: json.features.length };
      } else if ( params.returnIdsOnly ){
        var objectIds = [];
        json.features.forEach(function(f){
          objectIds.push( f.attributes.id );
        });
        json = {
          objectIdField: 'id',
          objectIds: objectIds
        };
      } 
      callback( json );
    }
  }

};
