var Cache = require('../../api/models/Cache.js'),
  config = require('../../config/local.js'),
  PostGIS = require('../../api/models/PostGIS.js');

Cache.db = PostGIS.connect(config.db.postgis.conn);

module.exports = Cache;
