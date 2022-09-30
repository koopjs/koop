# Roadmap

This document is meant to provide transparency in planning and implementation goals for the Koop project.

## July 2015

### Changes 
* FeatureService optimizations 
  * Make smarter requests to the DB based on queries 
  * clean up the logic to be easier to grok
* Refactor the lib/* files on a whole
  - We want pull out as much non-koop specific code as possible into separate modules
* Add support for the simple style spec - https://github.com/mapbox/simplestyle-spec
* Address consistency issues in method calls to the Cache from providers 
  - be clear and consitent about passing table names instead of "types" and "keys"

## September 2015

### Changes 
* Explore removing ogr2ogr as a dep for exporting file formats
### Additions 
* Support for exporting FGDB
* Support for OGC WMS and WFS 
* A koop desktop app built with something like Electron
