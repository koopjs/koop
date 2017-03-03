function Dataset (koop) {
  this.koop = koop
}

// Data Operations

Dataset.prototype.getFromCache = function (key, options, callback) {
  this.koop.cache.retrieve(key, options, callback)
}

Dataset.prototype.getData = function (req, callback) {
  this.koop.cache.retrieve(req.params.id, req.query, callback)
}

Dataset.prototype.insertIntoCache = function (key, geojson, options, callback) {
  this.koop.cache.insert(key, geojson, options, callback)
}

Dataset.prototype.upsertIntoCache = function (key, geojson, options, callback) {
  this.koop.cache.upsert(key, geojson, options, callback)
}

Dataset.prototype.deleteFromCache = function (key, callback) {
  this.koop.cache.delete(key, callback)
}

// Metadata Operations

Dataset.prototype.getFromCatalog = function (key, options, callback) {
  this.koop.cache.catalog.retrieve(key, options, callback)
}

Dataset.prototype.insertIntoCatalog = function (key, metadata, callback) {
  this.koop.cache.catalog.insert(key, metadata, callback)
}

Dataset.prototype.deleteFromCatalog = function (key, callback) {
  this.koop.cache.catalog.delete(key, callback)
}

module.exports = Dataset
