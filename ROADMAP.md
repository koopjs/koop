# Roadmap
The document is meant to provide transparency in what work is currently planned for Koop.

## v2.2.0 - July 2015
### Changes 
* FeatureService optimizations 
  * Make smarter requests to the DB based on queries 
  * clean up the logic to be easier to grok
* Refactor the lib/* files on a whole
  - We want pull out as much non-koop specific code as possible into separate modules
* Add support for the simple style spec - https://github.com/mapbox/simplestyle-spec

## v3.0.0 - September 2015
### Changes 
* Explore removing ogr2ogr as a dep for exporting file formats
