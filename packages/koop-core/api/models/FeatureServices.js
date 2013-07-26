/*---------------------
	:: Services
	-> model
---------------------*/
var terraformer = require('terraformer-arcgis-parser');

module.exports = {

	attributes: {
	},

  fieldTypes: {
    'string': 'esriFieldTypeString',
    'integer': 'esriFieldTypeInteger',
    'date': 'esriFieldTypeDate',
    'datetime': 'esriFieldTypeDate',
    'float': 'esriiFieldTypeDouble'
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

  query: function( data, callback ){
    var json = this.process('/../templates/featureSet.json', data );
    json.features = terraformer.convert( data );
    json.features.forEach(function( f, i ){
      if ( !f.attributes.id ){
        f.attributes.id = i+1;
      }
    });
    if ( callback ) callback( json );
  }

};
