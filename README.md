# Koop

> Transform, query, & download geospatial data on the web.

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![js-standard-style][standard-img]][standard-url]

[npm-img]: https://img.shields.io/npm/v/koop.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koop
[travis-img]: https://img.shields.io/travis/koopjs/koop/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/koop
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

**Note: Koop 3.0 was just released and these docs are going to get an overhaul. For now please see [this deck](https://goo.gl/ERLzM1) **

Koop is [Express middleware](http://expressjs.com/guide/using-middleware.html) for simplifying geographic data consumption across many different providers and in many different formats.

Koop provides a flexible server for dynamically transforming 3rd party data sources (APIs) into [Feature Services](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Query_Feature_Service_Layer/02r3000000r1000000/) and standard geographic data formats (GeoJSON, Shapefile, KML, CSV). This project is meant to provide a versatile platform for experimenting and working with various datasets within the global geospatial data ecosystem. Koop aims to allow easier access to any open data API and to make third party data easier to use within the realm of Esri's geospatial web products.

Visit the demo at [http://koop.dc.esri.com](http://koop.dc.esri.com).

## Architecture

![lots of geojson into feature services](https://cloud.githubusercontent.com/assets/351164/2530456/333495b0-b526-11e3-8f9b-c1ebeb75b044.png)

## Dependencies

Koop requires [Node.js](http://nodejs.org/) version 0.10.x or greater to run on your server or local machine.

### Recommended for production

Koop uses a local, in-memory object for caching data by default. If you want persistent and performant data caching, Koop needs access to a spatial database. We use and recommend [PostGIS](http://postgis.net) in production, but there is also experimental support for [ElasticSearch](https://www.elastic.co/products/elasticsearch).

See the [Caches](https://github.com/koopjs/koopjs.github.io/blob/master/docs/caches.md) section in the documentation for more information.


## Install

Koop should be installed as a dependency in a Node.js project:


```
npm install koop@^2 --save
```

### Pre-Installation on Windows

Make sure the `PYTHON` environmental variable is set:

```
SET PYTHON = C:\Python27\python\python.exe
```

## Install Providers

Koop requires **providers** which connect to specific API. For example, to install [`koop-github`](https://github.com/koopjs/koop-github):

```
npm install koop-github --save
```

For a complete list of providers, see the [documentation](https://github.com/koopjs/koopjs.github.io/blob/master/docs/providers.md). Read more about creating a new provider or modifying an existing provider [here](https://github.com/koopjs/koopjs.github.io/blob/master/docs/specs/provider.md).


## Creating a project


Koop works as [Express middleware](http://expressjs.com/guide/using-middleware.html). To use Koop you need a combination of Express, Koop, and Koop **providers**.

### Starting a new project

If you don't yet have a Node project started:

```
mkdir project-directory
cd !$
npm init
```

### Install Koop and providers

```
npm install koop@^2 --save
npm install koop-github --save
```

### Create a entry-point

Create and modify _index.js_

```javascript
// create a config object that tells koop where to write data
// and optionally what database cache to use
var config = {
  // "data_dir": "/usr/local/koop/",
  // "db": {
  //   "conn": "postgres://localhost/koopdev"
  // }
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

### Start the server and load data

```
node index.js
```

Then visit:

- [Installed Providers](http://localhost:1337/providers/)
- [GitHub Preview](http://localhost:1337/github/)
- [View GitHub File](http://localhost:1337/github/CityOfPhiladelphia/phl-open-geodata/school_facilities::philadelphiaschool_facilities201302/preview)
- [FeeatureServer Metadata](http://localhost:1337/github/CityOfPhiladelphia/phl-open-geodata/school_facilities::philadelphiaschool_facilities201302/FeatureServer)
- [Layer Query](http://localhost:1337/github/CityOfPhiladelphia/phl-open-geodata/school_facilities::philadelphiaschool_facilities201302/FeatureServer/0/query)

## Roadmap

See [ROADMAP.md](ROADMAP.md) to view the Koop project roadmap.

## Resources

* [Koop Documentation](https://koopjs.github.io/docs)
* [ArcGIS REST API Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/koopjs/koop/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

## License

[Apache 2.0](LICENSE)

<!-- [](Esri Tags: ArcGIS Web Mapping GeoJson FeatureServices) -->
<!-- [](Esri Language: JavaScript) -->
