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
    var fields = [];
    Object.keys( props ).forEach(function( key ){
      fields.push({
        name: key,
        type: self.fieldType( props[ key ] ),
        alias: key
      });
    });
    return fields;
  },

  process: function( tmpl, data ){
    var template = require(__dirname + tmpl);
    template.fields = this.fields( data.features[0].properties );
    return template;
  },

  info: function( data, callback ){
    var json = this.process('/../templates/featureService.json', data );
    callback && callback( json );
  },

  query: function( data, callback ){
    var json = this.process('/../templates/featureSet.json', data );
    json.features = terraformer.convert( data );
    callback && callback( json );
  }

};
