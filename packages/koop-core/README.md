# koop
### a node.js implimentation of ArcGIS Server

Note: This server is in active development and does not currently (and probably) never will attempt to impliment 100% of the GeoService Rest Spec

## Goal 

To provide a flexible server for exposing new/experimental data source and types as both Feature Services and other data formats. This server is meant to provide a simple platform to extend the currently supported functionality of ArcGIS Server, and act a means for benchmarking and showcasing new ideas around web mapping.

## Usage 

    npm install
    node app.js
    # visit [http://localhost:1337/geojson](http://localhost:1337/geojson) 


# Demo / Docs

Koop turns geojson into feature services and the links below act as documentation for the various kinds of things Koop supports. We've deployed [Koop to heroku]([http://koop.heroku.com/geojson](http://koop.heroku.com/geojson)) 

## Geojson 

  Koop comes with a couple geojson files stored in the api/geojson directory. You can place geojson file directly in there to test Koop.  

  * [http://koop.heroku.com/geojson](http://koop.heroku.com/geojson)
  * [http://koop.heroku.com/geojson/snow](http://koop.heroku.com/geojson/snow)
  * [http://koop.heroku.com/geojson/snow/FeatureServer](http://koop.heroku.com/geojson/snow/FeatureServer)
  * [http://koop.heroku.com/geojson/snow/FeatureServer/0](http://koop.heroku.com/geojson/snow/FeatureServer/0)
  * [http://koop.heroku.com/geojson/snow/FeatureServer/0/query](http://koop.heroku.com/geojson/snow/FeatureServer/0/query)

## Gists 

You can pull geojson data directly from a gist too.

  * [http://koop.heroku.com/gist/6021269](http://koop.heroku.com/gist/6021269)
  * [http://koop.heroku.com/gist/6021269/FeatureServer](http://koop.heroku.com/gist/6021269/FeatureServer)
  * [http://koop.heroku.com/gist/6021269/FeatureServer/0](http://koop.heroku.com/gist/6021269/FeatureServer/0)
  * [http://koop.heroku.com/gist/6021269/FeatureServer/0/query](http://koop.heroku.com/gist/6021269/FeatureServer/0/query)

## Github 

And of course github can store geojson files as well. Koop can turn those into featureservices too. 

  * [http://koop.heroku.com/github/colemanm/hurricanes/fl_2004_hurricanes](http://koop.heroku.com/github/colemanm/hurricanes/fl_2004_hurricanes)
  * [http://koop.heroku.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer](http://koop.heroku.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/)
  * [http://koop.heroku.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query](http://koop.heroku.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query)
  * Note: Repos can of course have directories, and this presents an issue with creating dynamic routes that match arbitrary paths in github. To sole this Koop will replace dashes with slashed in its github routes: 
    * [http://koop.heroku.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query](http://koop.heroku.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query)
    * The above url would pull down this geojson file: [https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson](https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson)

## Resources

* [ArcGIS Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Credit

Dymanic Map Layer code is based on code from https://github.com/sanborn/leaflet-ags/blob/master/src/AGS.Layer.Dynamic.js

## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet)
[](Esri Language: JavaScript)
