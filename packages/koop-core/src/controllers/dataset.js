/**
 * A base controller that we can use as a prototype
 */
function Controller (model) {
  this.model = model
}

Controller.prototype.insertIntoCache = function (req, res) {
  this.model.insertIntoCache(req.params.id, req.body, req.query, (err) => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json({status: 'Cached'})
  })
}

Controller.prototype.upsertIntoCache = function (req, res) {
  this.model.upsertIntoCache(req.params.id, req.body, req.query, (err) => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json({status: 'Cached'})
  })
}

Controller.prototype.getFromCache = function (req, res) {
  this.model.getFromCache(req.params.id, req.query, (err, geojson) => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json(geojson)
  })
}

Controller.prototype.deleteFromCache = function (req, res) {
  this.model.deleteFromCache(req.params.id, err => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json({status: 'Deleted'})
  })
}

Controller.prototype.insertIntoCatalog = function (req, res) {
  this.model.insertIntoCatalog(req.params.id, req.body, (err) => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json({status: 'Cached'})
  })
}

Controller.prototype.getFromCatalog = function (req, res) {
  this.model.getFromCatalog(req.params.id, (err, geojson) => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json(geojson)
  })
}

Controller.prototype.deleteFromCatalog = function (req, res) {
  this.model.deleteFromCatalog(req.params.id, err => {
    if (err) res.status(err.code || 500).json({error: err.message})
    else res.status(200).json({status: 'Deleted'})
  })
}

module.exports = Controller
