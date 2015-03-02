
## [1.0.18](https://github.com/Esri/koop/releases/tag/v1.0.18) - 2015-03-02
###Added 
- support for koop-pgcache to export workers

## [1.0.17](https://github.com/Esri/koop/releases/tag/v1.0.17) - 2015-03-02
###Changed
- Koop longer ships with default support for PostGIS or Spatiallite. These have become optional plugins
  - this means that need to be added the koop module at server start up time
  - koop now ships with a Local cache out of the box that is not persisted across server sessions


## [1.0.16](https://github.com/Esri/koop/releases/tag/v1.0.16) - 2015-02-13
###Changed
- Fized the package json missing the multipart post module  

## [1.0.15](https://github.com/Esri/koop/releases/tag/v1.0.15) - 2015-02-12
###Added
- added a the module connect-multipart to support multipart form posts

###Changes
- fixed the way feature service requests handle query strings to the info endpoints


## [1.0.14](https://github.com/Esri/koop/releases/tag/v1.0.14) - 2015-02-10
###Changed
- default routes needed to add support for POSTs to feature service endpoints
- worker exporters needed to exit more gracefully and stop working when a file fails to be created
- a typo in GeoJSON.fromEsri was crashing request pages in koop-agol
 

## [1.0.13](https://github.com/Esri/koop/releases/tag/v1.0.13) - 2015-02-02
###Changed 
- changed the way tiles are created, rather than creating a file on disk, now we just pass the mapnik XML around 
- using ST_Simplify instead of ST_SimplifyPreserveTopology for speed 

## [1.0.12](https://github.com/Esri/koop/releases/tag/v1.0.12) - 2015-01-29
### Added
- now sending the expiration time with the base json response, helps with cache life

### Changed 
- Tile styles are defaulted to points

## [1.0.11](https://github.com/Esri/koop/releases/tag/v1.0.11) - 2015-01-27
### Changed
- fixed support for bad outStatistics params in the url

## [1.0.10](https://github.com/Esri/koop/releases/tag/v1.0.10) - 2015-01-26
### Changed
- using mapnik-pool for all tiles now
- refactored tiles for better vector tile buffer/edge support in the mapnik
- PBF tiles are now deflated via zlib, which makes them smaller
  - providers need to set the header
    - `content-encoding: deflate`

## [1.0.9](https://github.com/Esri/koop/releases/tag/v1.0.9) - 2015-01-21
### Changed
- splitting objectIds for feature service queries
  - must be a string, not an array now (as per the geoservices rest spec)

## [1.0.8](https://github.com/Esri/koop/releases/tag/v1.0.8) - 2015-01-21
### Changed
- fixed an issue with object id fields in feature service queries for Ids with filters
  - when using returnIdsOnly the objectID was not getting set, which return false rows. 

## [1.0.7](https://github.com/Esri/koop/releases/tag/v1.0.7) - 2015-01-20
### Changed 
- lib/Tiles.js now passes along an optional name param to the tile generator. Vector tile use this name to store features. 
- fixed the tests, they are passing but jshint is not. 
- changed the way the lib/BaseController.js sends back its statuses. 

## [1.0.6](https://github.com/Esri/koop/releases/tag/v1.0.6) - 2015-01-16
### Added
- a flag to the lib/Exporter.js class that will lock export jobs to prevent duplicate jobs stepping on each other in the queue. 
  - This means that one job per dataset can be enqueued at a time. 
  - Down the road this may cause problems for when we want to pre-cache several formats for the same dataset at the same time. That bridge will be crossed at that time.  

## [1.0.5](https://github.com/Esri/koop/releases/tag/v1.0.5) - 2015-01-15
### Added 
- a flag to the lib/PostGIS.js cache too ignore the selection limit unless a provider wants to use it.
  - since this feature is used by only a couple providers it seemed better to make it an opt-in option for the few, rather than an opt-out option across every provider.  

## [1.0.3](https://github.com/Esri/koop/releases/tag/v1.0.3) - 2015-01-13
### Changed
- Fixed a bug in the ExportWorker where shps were being created as a directory with an extension .shp; this fixes some formatting errors that were related. 

## [1.0.2](https://github.com/Esri/koop/releases/tag/v1.0.2) - 2015-01-13
### Changed
- Koop exports now force OGR to create shp file dirs instead of files; This adds more consistency so the code can maintain a single way for creating zip exports
- The query support for outStatistics now removes any passed in slashes so it stops choking on parsing semi-bad inputs
- The large data limit was moved from 10k features to 2k. This helps koop when its deployed with workers in that more work is handed down to the workers, which is good. 


## [1.0.1](https://github.com/Esri/koop/releases/tag/1.0.1) - 2015-01-08
### Added
- for providers where hosts are used the info in the cache now stores the id of the host for that datasets
- new providers endpoints for accessing metadata about installed providers and all data in the cache per provider
- CSV files now get a BOM to help with parsing utf8 chars in Excel
- Updated the docs in the readme to be a tad bit cleaner

## [1.0.0](https://github.com/Esri/koop/releases/tag/1.0.0) - 2014-12-30
### Added
- Version 1.0.0 changes many thing
  - koop is now a module, installable via `npm install`
  - koop-server is no more; all central code is in the koop project
  - to use Koop you must use it as middleware in an app that boots up an http server 
