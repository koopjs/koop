var terraformerParser = require('terraformer-arcgis-parser'),
  fs = require('fs');

var Extent = require('./Extent.js'),
  Query = require('./Query.js');

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
    //if ( parseInt(value) ){
    //  return this.fieldTypes[ 'integer' ];
    //} else {
      var type = typeof( value );
      if ( type === 'number'){
        type = ( this.isInt( value ) ) ? 'integer' : 'float';
      }
      return this.fieldTypes[ type ];
    //}
  },

  // is the value an integer?
  isInt: function( v ){
    return Math.round( v ) === v;
  },

  fields: function( props, idField, list ){
    var self = this;
    var fields = [], 
      type, 
      fieldList;

    var keys = Object.keys( props );

    if (list) {
      fieldList = list;
      // if our keys and list are diff length we need to add an OID key
      // also make sure no ID or OBJECID is already included
      if (keys.length > list.length && (list.indexOf('OBJECTID') === -1 || list.indexOf('id') === -1 )) {
        fieldList.push('OBJECTID');
      }
    } else {
      fieldList = Object.keys( props );
    }
    fieldList.forEach(function( key, i ){
      if ( key === 'OBJECTID' && !idField){
        idField = key;
      }

      type = (( idField && key === idField ) ? 'esriFieldTypeOID' : (self.fieldType( props[ key ])||'esriFieldTypeString') );
      if (type){
        var fld = {
          name: key,
          type: type,
          alias: key
        };

        if (type === 'esriFieldTypeString'){
          fld.length = 128;
        }

        fields.push( fld );
      }
    });

    if ( !idField ){
      idField = 'id';
      fields.push({
        name: idField,
        type: 'esriFieldTypeOID',
        alias: idField
      });
    }
    
    return {
      oidField: idField, 
      fields: fields
    };
  },

  // load a template json file and attach fields
  process: function( tmpl, data, params ){
    var fieldObj;
    var template = JSON.parse(fs.readFileSync(__dirname + tmpl).toString());
    if ( !data.length && data.features && data.features.length ){
      fieldObj = this.fields( data.features[0].properties, params.idField, (data.info) ? data.info.fields : null ); 
      template.fields = fieldObj.fields;
      if (template.objectIdFieldName) {
        template.objectIdFieldName = fieldObj.oidField;
      } else {
        template.objectIdField = fieldObj.oidField;
      }
    } else if (data[0] && data[0].features[0] && data[0].features[0].length ) {
      fieldObj = this.fields( data[0].features[0].properties, params.idField, (data[0].info) ? data[0].info.fields : null);
      template.fields = fieldObj.fields;
      if (template.objectIdFieldName) {
        template.objectIdFieldName = fieldObj.oidField;
      } else {
        template.objectIdField = fieldObj.oidField;
      }
    } else {
      template.fields = [];
    }
    return template;
  },

  extent: function( features ){
    return Extent.bounds( features );
  },

  setGeomType: function( json, feature ){
    var tmplDir = '/../templates/';
    if ( feature && feature.geometry && ( feature.geometry.type.toLowerCase() === 'polygon' || feature.geometry.type.toLowerCase() === 'multipolygon')) {
      json.geometryType = 'esriGeometryPolygon';
      json.drawingInfo.renderer = require(__dirname + tmplDir + 'renderers/polygon.json');
    } else if ( feature && feature.geometry && (feature.geometry.type.toLowerCase() === 'linestring' || feature.geometry.type.toLowerCase() === 'multilinestring' )){
      json.geometryType = 'esriGeometryPolyline';
      json.drawingInfo.renderer = require(__dirname + tmplDir + 'renderers/line.json');
    } else {
      json.geometryType = 'esriGeometryPoint';
      json.drawingInfo.renderer = require(__dirname + tmplDir + 'renderers/point.json');
    }
    return json;
  },

  // returns the feature service metadata (/FeatureServere and /FeatureServer/0)
  info: function( data, layer, params, callback ){
    var lyr, json, self = this;
    var isLayer = false;
    if ( layer !== undefined ) {
      isLayer = true;
      // send the layer json
      data = (data && data[ layer ]) ? data[ layer ] : data;

      json = this.process('/../templates/featureLayer.json', data, params );
      json.name = data.name || 'Layer '+ layer;
      // set the geometry based on the first feature
      // TODO: could clean this up or use a flag in the url to pull out feature of specific type like nixta
      json = this.setGeomType( json, (data && data.features) ? data.features[0] : null );
      json.fullExtent = json.initialExtent = json.extent = this.extent( (!data.length) ? data.features : data[0].features );
      if ( this.isTable(json, data) ) {
        json.type = 'Table';
      }
    } else {
      // no layer, send the service json
      json = this.process('/../templates/featureService.json', (data && data[ 0 ]) ? data[ 0 ] : data, params);
      json.fullExtent = json.initialExtent = json.extent = this.extent( (!data.length) ? data.features : data[0].features );
      if ( data.length ){
        data.forEach(function( d, i){
          lyr = {
            id: i,
            name: d.name || 'layer '+i,
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 99999.99,
            maxScale: 0
          };
          if ( self.isTable( json, data ) ){
            json.tables[i] = lyr;
          } else {
            json.layers[i] = lyr;
          }
        });
      } else {
        lyr = {
          id: 0,
          name: data.name || "layer 1",
          parentLayerId: -1,
          defaultVisibility: true,
          subLayerIds: null,
          minScale: 99999.99,
          maxScale: 0
        };
        if ( this.isTable( json, data ) ){
          json.tables[0] = lyr;
        } else {
          json.layers[0] = lyr;
        }
      }
    }
    //if (isLayer && ( json.fullExtent.minx != undefined && json.fullExtent.miny != undefined && (!data.features.length || !data[0].features.length) ) ){
    //  json.type = 'Table';
    //}
    this.send( json, params, callback );
  },

  // if we have no extent, but we do have features; then it should be Table
  isTable: function( json, data ){
    return (((!json.fullExtent.xmin && !json.fullExtent.ymin) || (json.fullExtent.xmin === Infinity)) && (data.features || data[0].features));
  },

  // todo support many layers
  layers: function( data, params, callback ){
    var layerJson, json,
      self = this;

    if ( !data.length ){
      layerJson = this.process('/../templates/featureLayer.json', data, params );
      layerJson.extent = layerJson.fullExtent = layerJson.initialExtent = this.extent( data.features );
      json = { layers: [ layerJson ], tables: [] };
      this.send( json, params, callback );
    } else {
      json = { layers: [], tables: [] };
      data.forEach(function( layer, i ){
        layerJson = self.process('/../templates/featureLayer.json', layer, params );
        layerJson.id = i;
        layerJson.extent = layerJson.fullExtent = layerJson.initialExtent = self.extent( layer.features );
        json.layers.push( layerJson );
      });
      this.send( json, params, callback );
    }
  },

  // processes params based on query params
  query: function( data, params, callback ){
    var self = this,
      tmplDir = '/../templates/';


    // only deal with single layer datasets
    if ( data.length ){
      data = data[0];
    }

    if ( params.objectIds ) {
      this.queryIds( data, params, function( json ){
        self.send( json, params, callback );
      });
    } else {
      var json = this.process( tmplDir + 'featureSet.json', data, params );

      if ( !data.features || !data.features.length ){
        this.send( json, params, callback );
      } else {
        // geojson to esri json
        if ( !data.type ) { 
          data.type = 'FeatureCollection';
        }

        if ( data.features[0] && data.features[0].properties.OBJECTID ){
          json.features = terraformerParser.convert( data );
        } else {
          json.features = terraformerParser.convert( data , { idAttribute: 'id' } );
        }
        //json.features = terraformerParser.convert( data ,{idAttribute: 'id'});
        if ( json.features && json.features.length && ( json.features[0].geometry && json.features[0].geometry.rings )) {
          json.geometryType = 'esriGeometryPolygon';
          //json.drawingInfo.renderer = require(__dirname + tmplDir + 'renderers/polygon.json');
        } else if ( json.features && json.features.length && (json.features[0].geometry && json.features[0].geometry.paths )){
          json.geometryType = 'esriGeometryPolyline';
          //json.drawingInfo.renderer = require(__dirname + tmplDir + 'renderers/line.json');
        } else {
          json.geometryType = 'esriGeometryPoint';
          //json.drawingInfo.renderer = require(__dirname + tmplDir + 'renderers/point.json');
        }

        // create an id field if not existing
        if ( !params.idField ) {
          json.features.forEach(function( f, i ){
            if ( !f.attributes.id && !f.attributes.OBJECTID ){
              f.attributes.id = i+1;
            }
          });
        }

        // send back to controller
        this.send( json, params, callback );
      }
    }
  },

  queryIds: function( data, params, callback ){
    var json = this.process('/../templates/featureSet.json', data, params );
    var allFeatures = terraformerParser.convert( data ),
      features = [];

    // split the id list on comma, we need an array
    params.objectIds = params.objectIds.split(',');

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
      if ( params.objectIds.indexOf( id+'' ) > -1 ){
        features.push( f );
      }
    });
    json.features = features;
    if ( callback ) {
      callback( json );
    }
  },

  // filter the data based on any given query params
  send: function(json, params, callback){
    Query.filter( json, params, callback );
  }

};
