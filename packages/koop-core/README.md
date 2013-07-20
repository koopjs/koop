# koop
### a node.js implimentation of ArcGIS Server

### Note: This server is in active development and does not currently (and probably) never will attempt to impliment 100% of the GeoService Rest Spec

## Goal 

To provide a flexible server for exposing new/experimental data source and types as both Feature Services and other data formats. This server is meant to provide a simple platform to extend the currently supported functionality of ArcGIS Server, and act a means for benchmarking and showcasing new ideas around web mapping.

## Usage 

    npm install
    node app.js 

## Geojson 

  Koop comes with a couple geojson files stored in the api/geojson directory. You can place geojson file directly in there to test Koop.  

  [http://localhost:1337/geojson](http://localhost:1337/geojson)

## Gists 

You can pull geojson data directly from a gist too.

  * [http://localhost:1337/gist/6021269](http://localhost:1337/gist/6021269)
  * [http://localhost:1337/gist/6021269/FeatureServer](http://localhost:1337/gist/6021269/FeatureServer)
  * [http://localhost:1337/gist/6021269/FeatureServer/query](http://localhost:1337/gist/6021269/FeatureServer/query)

## Github 

And of course github can store geojson files as well. Koop can turn those into featureservices too. 

  * [http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes](http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes)
  * [http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer](http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/)
  * [http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/query](http://localhost:1337/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/query)
