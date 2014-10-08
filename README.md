# koop

## Turn data into FeatureServices 

Koop provides a flexible server for exposing 3rd party data sources (APIs) as both [Feature Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) and other data formats (GeoJSON). This project is meant to provide a simple / plugable platform for experimenting with various data within the ArcGIS platform. Koop aims to provide a platform for accessing any API and making it easy to consume within the realm of Esri's geospatial web products. 

Visit the demo at [http://koop.dc.esri.com](http://koop.dc.esri.com)


## Architecture 
![lots of geojson into featureservices](https://cloud.githubusercontent.com/assets/351164/2530456/333495b0-b526-11e3-8f9b-c1ebeb75b044.png)

## Dependencies 
The following dependencies are needed in order to run Koop on your local machine / server: 
* Node.js (version > 0.10.0)
* Database
  * Koop needs a spatial database to act as a cache for data
  * Currently supports PostGIS (PostgreSQL) and Spatialite (SQLite)

## Installation

1. clone the repo
   ```git clone git@github.com:Esri/koop.git```
2. enter the koop project directory 
    ```cd koop```
3. install the node.js dependencies
    ```npm install```

## Configuration 
Koop uses a series of config files in the ```/config``` directory to setup its database connection and data directories for caching data. 

**NOTE: it is crucial that you make the appropriate edits to your config/default.yml file so that the values match your environment.**

1. copy the example config file
    ```cp config/default.yml.example config/default.yml```
2.  edit config/default.yml for your environment.

In particular you will need to:

* Ensure that the specified logfile directory exists and you have write permissions on it.
* Ensure that the PostGIS database configuration matches the host, port, user, password, and name of your database. 
* For Github and Gist providers you will need to set the `github_token` property to match your personal Github API token.   

### Caching 

Koop uses either a local SQLite cache or a PostgreSQL/PostGIS database to store data so that it doesnt flood external API with requests. This is helpful to prevent API rate limits and general makes Koop faster (quick access to data). The local SQLite file should not be used for production as it has limits on scale and across processes and in production use you should use a PostgreSQL database.


## Running Koop
Koop runs its own HTTP server and will default to [port 1337](http://localhost:1337). 

### start the server with node:
```node server.js```

### to run on a non default port 
```PORT=8080 node server.js```


## Data Providers

Koop is designed to expose 3rd party services as FeatureServices that are consumable within Esri products and services. Currently Koop has the following providers shipped by default: 
  
* [ArcGIS Online](https://github.com/chelm/koop-agol)
* [GitHub](https://github.com/chelm/koop-github)
* [GitHub gist](https://github.com/chelm/koop-gist)
* [Socrata](https://github.com/chelm/koop-socrata)

Each provider resides in its own git repo (_e.g._ [koop-github](https://github.com/chelm/koop-github))

To install a provider all you need to do is: 

  ```npm install https://github.com/chelm/koop-github/tarball/master```


### Development

To modify the koop-server or develop new koop providers you install them to the `node_modules` directory in the koop application folder:

- check out `koop-server` and link in node_modules
```
 git clone git@github.com:Esri/koop-server.git
 cd koop-server && npm install
 cd node_modules && ln -s ../koop-server
```


### Defining a new provider 

- check out providers such as `koop-agol` and link in node_modules
```
 git clone git@github.com:Esri/koop-agol.git
 cd koop-agol && npm install
 cd node_modules && ln -s ../koop-agol
```

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
  * Note: Repos can of course have directories, and this presents an issue with creating dynamic routes that match arbitrary paths in github. To solve this Koop will replace dashes with slashed in its github routes: 
    * [http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query](http://koop.dc.esri.com/github/geobabbler/geodata/geojson-border_crossings/FeatureServer/0/query)
    * The above url would pull down this geojson file: [https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson](https://github.com/geobabbler/geodata/blob/master/geojson/border_crossings.geojson)


     
## Roadmap

Not all capabilities of [FeatureServices](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) are currently supported. It is planned to extend support for these as well as explore additional output formats.


## Resources
* [ArcGIS Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [twitter@esri](http://twitter.com/esri)

## Issues
Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing
Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Credit

## Licensing
Copyright 2014 Esri

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
