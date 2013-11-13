var terraformer = require('Terraformer');
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
    if ( !data.length ){
      template.fields = this.fields( data.features[0].properties, params.idField );
    } else {
      template.fields = this.fields( data[0].features[0].properties, params.idField );
    }
    return template;
  },

  extent: function( features ){
    var minx, 
      miny, 
      maxx, 
      maxy; 

    var first = false;
    features.forEach(function( f, i ){
      if (f.geometry && f.geometry.type == 'Point' ){
        if ( i == 0){
          minx = f.geometry.coordinates[0],
          miny = f.geometry.coordinates[1],
          maxx = f.geometry.coordinates[0],
          maxy = f.geometry.coordinates[1];
        }
        if (f.geometry.coordinates[0] < minx) minx = f.geometry.coordinates[0];
        if (f.geometry.coordinates[1] < miny) miny = f.geometry.coordinates[1];
        if (f.geometry.coordinates[0] > maxx) maxx = f.geometry.coordinates[0];
        if (f.geometry.coordinates[1] > maxy) maxy = f.geometry.coordinates[1];
      } else if ( f.geometry && ( f.geometry.type == 'Polygon' || f.geometry.type == 'MultiPolygon') && f.geometry.coordinates ) {
        var coords = (f.geometry.type == 'MultiPolygon') ? f.geometry.coordinates[0][0] : f.geometry.coordinates[0];
        coords.forEach(function( c, j ) {
          if ( i == 0){
            minx = c[0],
            miny = c[1],
            maxx = c[0],
            maxy = c[1];
          }
          if (c[0] < minx) minx = c[0];
          if (c[1] < miny) miny = c[1];
          if (c[0] > maxx) maxx = c[0];
          if (c[1] > maxy) maxy = c[1];
        });
      }
    });

    return {
        "xmin": minx,
        "ymin": miny,
        "xmax": maxx,
        "ymax": maxy,
        "spatialReference": {
          "wkid": 4326,
          "latestWkid": 4326
        }
    };

  },

  setGeomType: function( json, feature ){
     var tmpl_dir = '/../templates/';
     if ( feature.geometry.type.toLowerCase() == 'polygon' || feature.geometry.type.toLowerCase() == 'multipolygon') {
        json.geometryType = 'esriGeometryPolygon';
        json.drawingInfo.renderer = require(__dirname + tmpl_dir + 'renderers/polygon.json');
      } else if ( feature.geometry.type.toLowerCase() == 'linestring' ){
        json.geometryType = 'esriGeometryPolyline';
        json.drawingInfo.renderer = require(__dirname + tmpl_dir + 'renderers/line.json');
      } else {
        json.geometryType = 'esriGeometryPoint';
        json.drawingInfo.renderer = require(__dirname + tmpl_dir + 'renderers/point.json');
      }
    return json;
  }, 

  // returns the feature service metadata (/FeatureServere and /FeatureServer/0)
  info: function( data, layer, params, callback ){
    if ( layer !== undefined ) {
      // send the layer json
      data = (data && data[ layer ]) ? data[ layer ] : data;
      var json = this.process('/../templates/featureLayer.json', data, params );
      json.name = data.name;
      // set the geometry based on the first feature 
      // TODO: could clean this up or use a flag in the url to pull out feature of specific type like nixta
      json = this.setGeomType( json, data.features[0] );
    } else {
      // no layer, send the service json
      var json = this.process('/../templates/featureService.json', (data && data[ 0 ]) ? data[ 0 ] : data, params);
      if ( data.length ){
        data.forEach(function( d, i){
          json.layers[i] = {
            id: i,
            name: d.name || 'layer '+i,
            parentLayerId: -1,
            defaultVisibility: true,
            subLayerIds: null,
            minScale: 99999.99,
            maxScale: 0
          };
        });
      } else {
        json.layers[0] = {
          id: 0,
          name: "layer 1",
          parentLayerId: -1,
          defaultVisibility: true,
          subLayerIds: null,
          minScale: 99999.99,
          maxScale: 0
        };
      }
    }
    json.fullExtent = json.initialExtent = json.extent = this.extent( (!data.length) ? data.features : data[0].features );
    this.send( json, params, callback );
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
    var self = this;
      tmpl_dir = '/../templates/';    

    if ( params.objectIds ) {
      this.queryIds( data, params, function( json ){ 
        self.send( json, params, callback );
      });
    } else { 
      var json = this.process( tmpl_dir + 'featureSet.json', data, params );
      // geojson to esri json
      json.features = terraformerParser.convert( data );
      if ( json.features[0].geometry.rings ) { 
        json.geometryType = 'esriGeometryPolygon';
        //json.drawingInfo.renderer = require(__dirname + tmpl_dir + 'renderers/polygon.json');
      } else if ( json.features[0].geometry.paths ){
        json.geometryType = 'esriGeometryPolyline';
        //json.drawingInfo.renderer = require(__dirname + tmpl_dir + 'renderers/line.json');
      } else {
        json.geometryType = 'esriGeometryPoint';
        //json.drawingInfo.renderer = require(__dirname + tmpl_dir + 'renderers/point.json');
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
