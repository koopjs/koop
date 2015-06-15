# Koop

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]

[npm-img]: https://img.shields.io/npm/v/koop.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koop
[travis-img]: https://img.shields.io/travis/Esri/koop.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/koop

**Turn data into Feature Services.**

Koop is [Express middleware](http://expressjs.com/guide/using-middleware.html) for simplifying  geographic data consumption across many different providers and in many different formats.

Koop provides a flexible server for exposing 3rd party data sources (APIs) as both [Feature Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) and standard geographic data formats (GeoJSON, Shapefile, KML, CSV). This project is meant to provide a versatile platform for experimenting and working with various data within the global geospatial data ecosystem. Koop aims to allow easy access to any API and to make it easy to consume within the realm of Esri's geospatial web products.

Visit the demo at [http://koop.dc.esri.com](http://koop.dc.esri.com).

## Architecture

![lots of geojson into feature services](https://cloud.githubusercontent.com/assets/351164/2530456/333495b0-b526-11e3-8f9b-c1ebeb75b044.png)

## Dependencies

Koop requires [Node.js](http://nodejs.org/) version 0.10.x or greater to run on your server or local machine.

### Recommended for production

Koop uses a local, in-memory object for caching data by default. If you want persistent and performant data caching, Koop needs access to a spatial database. We use and recommend [PostGIS](http://postgis.net) in production, but there is also experimental support for [ElasticSearch](https://www.elastic.co/products/elasticsearch).

See the [Caches](https://github.com/koopjs/koopjs.github.io/blob/master/docs/caches.md) section in the documentation for more information.

## Install

Koop should be installed as a dependency in a Node.js project like so:

```
npm install koop --save
```

### Pre-Installation on Windows

Make sure the `PYTHON` environmental variable is set:

```
SET PYTHON = C:\Python27\python\python.exe
```

## Usage

Koop works as [Express middleware](http://expressjs.com/guide/using-middleware.html). To use Koop you need a combination of Express, Koop, and Koop **providers**. Once Koop is in a project, you can add a Koop provider like [`koop-github`](https://github.com/koopjs/koop-github):

```
npm install koop-github --save
```

For a complete list of providers, see the [documentation](https://github.com/koopjs/koopjs.github.io/blob/master/docs/providers.md).

### Registering Providers

Once you've installed koop and chosen a provider to work with you need to **register** the provider with Koop.

```javascript
// create a config object that tells koop where to write data and what db to use
var config = {
  "data_dir": "/usr/local/koop/",
  "db": {
    "conn": "postgres://localhost/koopdev"
  }
};

// pass the config to koop
var koop = require('koop')(config);

// require and register the provider to bind its routes and handlers
var github = require('koop-github');
koop.register(github);

// create an express app
var app = require('express')();

// add koop middleware to the express app
app.use(koop);

// start the express server
app.listen(process.env.PORT || 1337, function () {
  console.log('Listening at http://localhost:%d/', this.address().port);
});
```

Read more about creating a new provider or modifying an existing provider [here](https://github.com/koopjs/koopjs.github.io/blob/master/docs/specs/provider.md).

## Roadmap

See [ROADMAP.md](ROADMAP.md) to view the Koop project roadmap.

## Resources

* [Koop Documentation](https://github.com/koopjs/koopjs.github.io/tree/master/docs)
* [ArcGIS REST API Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/Esri/koop/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

## License

Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](license.txt) file.

[](Esri Tags: ArcGIS Web Mapping GeoJson FeatureServices)
[](Esri Language: JavaScript)
