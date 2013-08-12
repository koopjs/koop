var terraformer = require('terraformer'),
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

        callback({ count: json.features.length });

      } else if ( params.returnIdsOnly ){

        this.getIds( json, params.idField, function( ids ){
          callback( ids );
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
        
        callback( json );

      }

    }

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
          [geom.xmax, geom.ymin],
          [geom.xmax, geom.ymax],
          [geom.xmin, geom.ymax],
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
          featureGeom = new terraformer.Polygon([ f.geometry.rings ]);
        } else if ( f.geometry.paths ) {
          featureGeom = new terraformer.LineString( f.geometry.paths );
        }
    
        if ( featureGeom ) { 
          return geometry.contains( featureGeom );
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
          return geometry.within( featureGeom ); //featureGeom.within( geometry ); 
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
    delete params.where;

    if ( params.where != '1=1' ){
      var features = [];
      _.each(json.features, function(f){
        var param = where.conditions.left.value;
        var val = where.conditions.right.value;
        if ( this.whereOps[ where.conditions.operation ] && this.whereOps[ where.conditions.operation ]( f.attributes[ param ], val ) ) features.push( f );  
      }, this);
      json.features = features;
    }

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

    callback( {
      objectIdField: field,
      objectIds: objectIds
    });
  }

};
