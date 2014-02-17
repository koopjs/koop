var PostGIS = require('../../api/models/PostGIS.js'),
  Cache = require('../../api/models/Cache.js');

Cache.db = PostGIS.connect( 'postgres://localhost/koopdev' );

module.exports = Cache;
