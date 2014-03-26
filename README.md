# koop
## Turn GeoJSON into FeatureServices 

Koop provides a flexible server for exposing 3rd party data sources (APIs) as both Feature Services and other data formats. This project is meant to provide a simple / plugable platform for experimenting with various data within the ArcGIS platform. Koop aims to provide a platform for accessing any API and making it easy to consume within the realm of Esri's geospatial web products. 


## Architecture 

![lots of geojson into featureservices](https://f.cloud.github.com/assets/351164/864572/24113276-f624-11e2-831d-50cf8395b200.png)


## Dependencies 

The following dependencies are needed in order to run Koop on your local machine / server: 

* Node.js (version > 0.10.0) 
* PostgreSQL / PostGIS 

## 

## Installation 

Koop is a [Node.js](http://nodejs.org/) project so you'll need [Node.js](http://nodejs.org/), preferably a version > 0.10.0. 

```
    # clone the repo
    git clone git@github.com:ArcGIS/koop.git

    # enter the koop project directory 
    cd koop

    # copy the example config file and make local edits 
    cp config/local.js.example config/local.js 

    # NOTE: it is crucial that you make the appropriate edits to your config/local.js file so that the values match your environment.

    # install the node.js dependencies
    npm install

    # run the server in auto-reload mode
    grunt server 

    # visit [http://localhost:1337](http://localhost:1337)
```

## Configuration 

Koop uses a config called `/config/local.js` to setup its database connection and data directories for caching data. When you first clone koop you'll need to copy `/config/local.js.example` to `/config/local.js` and change the defaults. 

In order to use the Github and Gist providers you'll need to correctly set the "github_token" property to match your personal Github API token.  

Also make sure you update the PostGIS database configuration to match the host, port, user, password, and name of your database.  

   
### PostGIS 

Koop currently requires a PostGIS database to be created when the app starts up. In PostgreSQL 9.3 you can create a PostGIS enabled database by executing `CREATE EXTENSION postgis;` inside an existing database. 

 

## Running Koop

Koop run its own http server and you can start it like this (koop will use 1337 as its default port): 

```
    // to run with
    node app.js   

    // to run on a non default port 
    PORT=9999 node app.js


    // optionally you can start the server via grunt 
    grunt server 
     
```

## Tests 

Currently the tests use grunt to run them, and they depend on a locally running instance of koop. Once you have koop running issue: 

```javascript 
    # install grunt if you dont have it
    sudo npm install -g grunt-cli

    # run the tests 
    grunt test 
```  


# Demo + More Docs

We've deployed a sample server as a testbed / proof of concept to [http://koop.dc.esri.com](http://koop.dc.esri.com)

## Data Providers

Koop is now designed to expose 3rd party services as FeatureServices that are consumable within Esri products and services. Currently Koop has the following providers shipped by default: 
  
  * gists
  * github 
  * agol 
  * socrata 

Each provider resides in ``api/providers/``


### Defining a new provider 

Each provider defines custom routes, a controller, and a model. Each of these uses ``module.exports`` to export an object (common js modules).  Each is then fused into koop at start up time and becomes available within the server. 

"Note": The name of the provider dir is used to define the name of the provider and its controller within koop. 

#### Routes
  * Define custom routes in the "routes" index.js file: 

```javascript      
        // defined in api/providers/sample/routes/index.js
 
        module.exports = {
          'get /sample': {
            controller: 'sample',
            action: 'index'
          }
        }
```
      

  * The above creates a ``/sample`` route that calls the ``index`` method on the sample controller ( defined in ``/api/providers/sample/controller/index.js`` ).     

#### Controller
  * Defines the handlers to used to respond to routes

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
  * each method takes in a request and response property and needs to send something to the reponse. 
 
#### Models 
  * Should be used to interact directly with 3rd party services and databases
  * Models make the http requests to API and should hand back raw data to the controllers



## Example URL Structure 1: Gists as a FeatureService  

  * [http://koop.dc.esri.com/gist/6021269](http://koop.dc.esri.com/gist/6021269)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer](http://koop.dc.esri.com/gist/6021269/FeatureServer)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer/0](http://koop.dc.esri.com/gist/6021269/FeatureServer/0)
  * [http://koop.dc.esri.com/gist/6021269/FeatureServer/0/query](http://koop.dc.esri.com/gist/6021269/FeatureServer/0/query)

## Example URL Structure 2: Github Repo as a FeatureService

  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes)
  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/)
  * [http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query](http://koop.dc.esri.com/github/colemanm/hurricanes/fl_2004_hurricanes/FeatureServer/0/query)
  * Note: Repos can of course have directories, and this presents an issue with creating dynamic routes that match arbitrary paths in github. To sole this Koop will replace dashes with slashed in its github routes: 
    * [http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query](http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query)
    * The above url would pull down this geojson file: [https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson](https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson)


## Feature Service Support 

We'd like to have full feature service query support from any geojson data source. Currently the coverage is limited to the following params: 

To see a full list of what koop will support in time visit [http://resources.arcgis.com/en/help/arcgis-rest-api/](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/)

     
## Caching 

Koop uses either a local cache or a MongoDB instance to store data so that it doesnt flood external API with requests. This is helpful for avoiding API rate limits and general makes Koop faster (quick access to data). By default Koop will use a local hash to store data, but this is inefficient and doesnt persist across processes. To get around this Koop can use MongoDB which works well for non-relational data and has the added bonus of having geospatial query support. 

## Resources

* [ArcGIS Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [twitter@esri](http://twitter.com/esri)
* 

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Credit

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

[](Esri Tags: ArcGIS Web Mapping GeoJson FeatureServices)
[](Esri Language: JavaScript)
