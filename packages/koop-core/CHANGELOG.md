
## [1.0.3](https://github.com/Esri/koop/releases/tag/1.0.3) - 2015-01-13
### Changed
- Fixed a bug in the ExportWorker where shps were being created as a directory with an extension .shp; this fixes some formatting errors that were related. 

## [1.0.2](https://github.com/Esri/koop/releases/tag/1.0.2) - 2015-01-13
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
