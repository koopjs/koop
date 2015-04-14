# koop

[![npm version](https://img.shields.io/npm/v/koop.svg?style=flat-square)](https://www.npmjs.com/package/koop)
[![build status](https://img.shields.io/travis/Esri/koop.svg?style=flat-square)](https://travis-ci.org/Esri/koop)

**Turn data into Feature Services.**

Koop is a node.js module that exposes an [Express](http://expressjs.com/) server for the purpose of being used as middleware within an Express based application.

Koop provides a flexible server for exposing 3rd party data sources (APIs) as both [Feature Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) and other data formats (GeoJSON). This project is meant to provide a simple / pluggable platform for experimenting with various data within the ArcGIS platform. Koop aims to provide a platform for accessing any API and making it easy to consume within the realm of Esri's geospatial web products.

Visit the demo at [http://koop.dc.esri.com](http://koop.dc.esri.com).

## Architecture

![lots of geojson into feature services](https://cloud.githubusercontent.com/assets/351164/2530456/333495b0-b526-11e3-8f9b-c1ebeb75b044.png)

## Dependencies

The following dependencies are needed in order to run Koop on your local machine / server:

* [Node.js](http://nodejs.org/) (version > 0.10.0)
* A spatial database
  * Koop needs a spatial database to act as a cache for data
  * Currently supports PostGIS (PostgreSQL) and SpatiaLite (SQLite)


## Pre-Installation on Windows
1. Setup the Python environmental variable

  ```
  # Windows
  SET PYTHON = C:\Python27\python\python.exe
  ```

## Installation

Basic installation would occur within an existing or new node.js project like so

  ```
  npm install koop
  ```

Then you would install a Koop Provider, like Github (see below for a full list of providers)

  ```
  npm install koop-github
  ```

## Registering Providers

Once you've installed koop and chosen a provider to work with you need to "register" the provider with koop

  ```javascript
  // create a config object that tells koop where to write data and what db to use
  var config = {
    "server": { "port": 1337 },
    "data_dir": "/usr/local/koop/",
    "db": {
      "postgis": {
          "conn": "postgres://localhost/koopdev"
      }
    }
  };

  // pass the config to koop
  var koop = require('koop')( config ),
  github = require('koop-github');

  // register the provider with koop to bind its routes/handlers
  koop.register( github );

  // create an express app
  var express = require("express")
  var app = express();

  // add koop middleware to the express app
  app.use( koop );

  // start the express server
  app.listen(process.env.PORT || config.server.port,  function() {
    console.log("Listening at http://%s:%d/", this.address().address, this.address().port);
  });
  ```

## Data Providers

Koop is designed to expose 3rd party services as Feature Services that are consumable within Esri products and services. Currently Koop has the following providers shipped by default:

* [ArcGIS Online](https://github.com/Esri/koop-agol)
* [GitHub](https://github.com/koopjs/koop-github)
* [GitHub gist](https://github.com/koopjs/koop-gist)
* [Socrata](https://github.com/koopjs/koop-socrata)

Each provider resides in its own git repo (e.g. [koop-github](https://github.com/koopjs/koop-github)).

## Development

To modify [koop](https://github.com/esri/koop) or develop new koop providers, install them to the `node_modules` directory in the koop application folder:

### Defining a new provider

- Check out providers such as [koop-agol](https://github.com/Esri/koop-agol) and link in `node_modules/`

  ```
  git clone git@github.com:Esri/koop-agol.git
  cd koop-agol && npm install
  cd node_modules && ln -s ../koop-agol
  ```

Each provider defines custom routes, a controller, and a model. Each of these uses ``module.exports`` to export an object (common js modules).  Each is then fused into koop at start up time and becomes available within the server.

**Note**: The name of the provider directory is used to define the name of the provider and its controller within koop.

#### Routes

* Define custom routes in the `routes/index.js` file:

  ```javascript
    // defined in api/providers/sample/routes/index.js

    module.exports = {
      'get /sample': {
        controller: 'sample',
        action: 'index'
      }
    }
  ```

* The above creates a `/sample` route that calls the `index` method on the sample controller (defined in `/api/providers/sample/controller/index.js`)

#### Controller

* Defines the handlers used to respond to routes

  ```javascript
    module.exports = {
      // this tells koop to treat this provider like AGS service and show up at the root data provider endpoint
      provider: false,

      // our index method to simple print text
      index: function(req, res){
        res.send('Sample Providers, to make this a real one set provider true');
      }

    };
  ```

* Each method takes in a request and response property and needs to send something to the reponse

#### Models

* Should be used to interact directly with 3rd party services and databases
* Models make the http requests to API and should hand back raw data to the controllers

#### Example URL Structure 1: Gists as a Feature Service

  * [http://koop.dc.esri.com/gist/6021269](http://koop.dc.esri.com/gist/6021269)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer](http://koop.dc.esri.com/gist/6021269/FeatureServer)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer/0](http://koop.dc.esri.com/gist/6021269/FeatureServer/0)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer/0/query](http://koop.dc.esri.com/gist/6021269/FeatureServer/0/query)

#### Example URL Structure 2: Github Repo as a Feature Service

  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes)
  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/)
  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query)
  * Note: Repos can of course have directories, and this presents an issue with creating dynamic routes that match arbitrary paths in github. To solve this Koop will replace dashes with slashes in its github routes:
    * [http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query](http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query)
    * The above url would pull down this geojson file: [https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson](https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson)

## Roadmap

Not all capabilities of [Feature Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) are currently supported. It is planned to extend support for these as well as explore additional output formats.

## Resources

* [ArcGIS REST API Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for Developers](http://developers.arcgis.com)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/Esri/koop/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

## Licensing

Copyright 2014 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](./license.txt) file.

[](Esri Tags: ArcGIS Web Mapping GeoJson FeatureServices)
[](Esri Language: JavaScript)
