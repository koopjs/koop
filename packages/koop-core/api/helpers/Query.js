var terraformer = require('Terraformer'),
  sql = require('sql-parser'),
  _ = require('underscore');

module.exports = {
  // process all query params filters 
  filter: function( json, params, callback ){

    if ( params.geometry ){
      this.geometryFilter( json, params, callback );
    } else if ( params.where ){
      this.whereFilter( json, params, callback );
    } else {

      if ( params.returnCountOnly ){

        callback( null, { count: json.features.length });

      } else if ( params.returnIdsOnly ){

        this.getIds( json, params.idField, function( err, ids ){
          callback( err, ids );
        });

      } else {

        if ( ( params.returnGeometry === false || params.returnGeometry == 'false') && (!params.outFields || params.outFields != '*')){
          json.features.forEach(function(f){
            delete f.geometry;
          });
        } else if ( params.outSR && ( params.outSR == '102100' ) ){
          if ( json.spatialReference ){
            json.spatialReference.wkid = params.outSR;
            var coords;
            // project each geometry to merator  
            json.features.forEach( function( f ){
              if ( f.geometry.x && f.geometry.y ) {
                coords = new terraformer.Point( [f.geometry.x, f.geometry.y] ).toMercator().coordinates;
                f.geometry.x = coords[0];
                f.geometry.y = coords[1];
              } else if ( f.geometry.rings ){
                f.geometry.rings = new terraformer.Polygon( f.geometry.rings ).toMercator().coordinates;
              } else if ( f.geometry.paths ) { 
                f.geometry.paths = new terraformer.LineString( f.geometry.paths ).toMercator().coordinates;
              }
              f.geometry.spatialReference.wkid = params.outSR;
            });
          }
        }

        // checkout for outfields 
        if ( params.outFields && params.outFields != '*' ){
          var features = [],
            props,
            outFields = params.outFields.split( ',' );

          json.features.forEach( function( f ){
            props = _.pick(f.attributes || f.properties, outFields);
            
            var newFeature = { geometry: f.geometry}; 
            if ( f.properties ) { 
              newFeature.properties = props;
            } else {
              newFeature.attributes = props;
            } 
            features.push( newFeature );
          });
          json.features = features;
        }

        // before we send back json, process outStats
        if ( params.outStatistics ){
          this.outStatistics( json, params, callback );
        } else {
          callback( null, json );
        }
        

      }

    }

  },

  calculateStat: function(type, field, features){
    var propName = (features[0].attributes) ? 'attributes' : 'properties';
    var types = {
      'min': function(field, features){
        var min = features[0][propName][field];
        features.forEach(function(f,i){
          if (f[propName][field] < min){
            min = f[propName][field];
          }
        });
        return min;
      }, 
      'max': function(field, features){
        var max = features[0][propName][field];
        features.forEach(function(f,i){
          if (f[propName][field] > max){
            max = f[propName][field];
          }
        });
        return max;
      },
      'count': function(field, features){
        var count = 0;
        features.forEach(function(f,i){
          if (f[propName][field]){
            count++;
          }
        });
        return count;
      },
      'sum': function(field, features){
        var sum = 0;
        features.forEach(function(f,i){
          if (f[propName][field]){
            sum += parseFloat(f[propName][field]);
          }
        });
        return sum;
      },
      'avg': function(field, features){
        var sum = types['sum'](field, features);
        return sum/features.length;
      },
      'stddev': function(field, features){
        var v = types['var']( field, features );
        return Math.sqrt(v);
      },
      'var': function(field, features){
        var avg = types['avg']( field, features ), 
          i = features.length,
          v = 0;
 
        while( i-- ){
          v += Math.pow( (features[ i ][propName][field] - avg), 2 );
        }
        v /= features.length;
        return v;
      }
    };
    //count | sum | avg | stddev | var
    return types[type](field, features);
  },

  outStatistics: function( json, params, callback ){
    var result = {}, value, self = this;
    try { 
      json.fields = [];
      var statFeatures = [{attributes:{}}];
      var stats = JSON.parse(params.outStatistics);
      if (stats.length){
        stats.forEach(function(stat, i){
          //console.log(stat.statisticType, stat.onStatisticField, json.features.length );
          value = self.calculateStat( stat.statisticType, stat.onStatisticField, json.features );
          statFeatures[ 0 ].attributes[ stat.outStatisticFieldName ] = value;
          json.fields.push({
            name: stat.outStatisticFieldName,
            type: self.fieldType( value ),
            alias: stat.outStatisticFieldName
          });
        });
        json.features = statFeatures;
        callback(null, json);
      } else { 
        callback("'outStatistics' parameter is invalid", null);
      }
      
    } catch (e){
      callback("'outStatistics' parameter is invalid", null);
    }

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

  geometryTypes: {
    esriGeometryPoint: function( geom ){
      var coords = geom.split(',');
      return new terraformer.Point([ coords[0], coords[1] ]);
    }, 
    esriGeometryMultipoint: function( geom ){
      throw ''
    }, 
    esriGeometryPolyline: function( geom ){
      // not supported yet
    }, 
    esriGeometryPolygon: function( geom ){
      // not supported yet
    },
    esriGeometryEnvelope: function( geom ){
      if ( typeof( geom ) == 'object' ) {
        var box = new terraformer.Polygon( [[ 
          [geom.xmin, geom.ymin],
          [geom.xmin, geom.ymax],
          [geom.xmax, geom.ymax],
          [geom.xmax, geom.ymin],
          [geom.xmin, geom.ymin] 
        ]]);
        if (geom.spatialReference && geom.spatialReference.wkid == '102100'){
          return box.toGeographic();
        } else {
          return box;
        }
      } else {
        var geom = geom.split(',').map(function(v){ return parseFloat(v); });
        return new terraformer.Polygon([[
          [geom[0], geom[1]], 
          [geom[0], geom[3]], 
          [geom[2], geom[3]], 
          [geom[2], geom[1]], 
          [geom[0], geom[1]] 
        ]]);
      }
    }
  },


  parseGeometry: function( geom, type ){
    try {
      geom = JSON.parse( geom );
      if ( geom.xmin ){
        return this.geometryTypes[ type ]( geom );
      } else {
        return this.geometryTypes[ type ]( geom );
      }
    } catch( e ){
      return this.geometryTypes[ type ]( geom );
    }
  },

  // NEED to support these: 
  //========================================================================================================
    // esriSpatialRelIntersects
    // esriSpatialRelContains 
    // esriSpatialRelCrosses 
    // esriSpatialRelEnvelopeIntersects 
    // esriSpatialRelIndexIntersects 
    // esriSpatialRelOverlaps 
    // esriSpatialRelTouches 
    // esriSpatialRelRelation
  //========================================================================================================
  spatialFilter: {
    esriSpatialRelContains: function( features, geometry ){
      var self = this;
      return _.filter( features, function( f ){ 
        var featureGeom;
        if ( f.geometry.x && f.geometry.y ){
          featureGeom = new terraformer.Point([ f.geometry.x, f.geometry.y ]);
        } else if ( f.geometry.rings ){
          featureGeom = new terraformer.Polygon( f.geometry.rings );
        } else if ( f.geometry.paths ) {
          featureGeom = new terraformer.LineString( f.geometry.paths );
        }
    
        if ( featureGeom ) {
          return featureGeom.within( geometry );
        }
      });
    },
    esriSpatialRelWithin: function( features, geometry ){
      return _.filter( features, function( f ){ 
        var featureGeom;
        if ( f.geometry.x && f.geometry.y ){
          featureGeom = new terraformer.Point([ f.geometry.x, f.geometry.y ]);
        } else if ( f.geometry.rings ){
          featureGeom = new terraformer.Polygon([ f.geometry.rings ]);
        } else if ( f.geometry.paths ) {
          featureGeom = new terraformer.LineString( f.geometry.paths );
        }
        if ( featureGeom ) { 
          return featureGeom.within(geometry); 
        }
      });  
    } 
  },


  // subset the features by geometry
  // TODO support more that points 
  geometryFilter: function(json, params, callback){

    // Parse the geometry
    var type = params.geometryType || 'esriGeometryEnvelope';
      delete params.geometryType;
    var geometry = this.parseGeometry( params.geometry , type ); 
      delete params.geometry;

    var spatialRel = params.spatialRel || 'esriSpatialRelContains';
    if ( this.spatialFilter[ spatialRel ] ){
      json.features = this.spatialFilter[spatialRel]( json.features, geometry);
    }

    // recycle the params after we run the geom filter
    this.filter( json, params, callback );
  },


  // process the where filter in the params 
  // TODO actually support parsing where clauses 
  whereFilter: function( json, params, callback ){
    var where = sql.parse( 'select * from foo where '+ params.where).where;

    var features = [];
    _.each(json.features, function(f){
      var props = f.attributes || f.properties;
      var param = where.conditions.left.value;
      var val = where.conditions.right.value;
      if ( ( this.whereOps[ where.conditions.operation ] && props[ param ] && this.whereOps[ where.conditions.operation ]( props[ param ], val ) ) || param == val ) { 
        features.push( f );
      }
    }, this);
    json.features = features;
     
    delete params.where;
    // recycle the data + params through the filter fn
    this.filter( json, params, callback );
  },

  whereOps:{
    '<': function( param, val ){
      return (param < val); 
    },
    '=': function( param, val ){
      return (param == val);
    },
    '==': function( param, val ){
      return (param == val);
    },
    '<=': function( param, val ){
      return (param <= val);
    },
    '>': function( param, val ){
      return (param > val);
    },
    '>=': function( param, val ){
      return (param >= val);
    }
  },


  // returns only the ids of the features ( when returnIdsOnly=true )
  getIds: function( json, field, callback ){
    field = field || 'id';
    var objectIds = [],
      props;
    json.features.forEach( function(f){
      props = f.attributes || f.properties;
      objectIds.push( props[ field ] );
    });

    callback( null, {
      objectIdField: field,
      objectIds: objectIds
    });
  }

};
