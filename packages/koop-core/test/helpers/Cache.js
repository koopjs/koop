var Cache = require('../../api/models/Cache.js'),
  PostGIS = require('../../api/models/PostGIS.js');

Cache.db = PostGIS.connect('postgres://localhost/koopdev');

module.exports = Cache;
