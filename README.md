# Koop

*Translate, query, & integrate any geospatial API on the web*

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![js-standard-style][standard-img]][standard-url]

Koop is a highly-extensible Javascript toolkit for connecting incompatible spatial APIs. Out of the box it exposes a Node.js server that can translate [GeoJSON](http://geojson.org/) into the [Geoservices specification](https://geoservices.github.io) supported by the [ArcGIS](http://www.esri.com/arcgis/about-arcgis) family of products. Koop can be extended to translate data from any source to any API specification. Don't let API incompatiblity get in your way, start using one of Koop's data providers or [write your own](https://koopjs.github.io/docs/specs/provider.html).

Visit the demo at [http://koop.dc.esri.com](http://koop.dc.esri.com).

![lots of geojson into feature services](https://user-images.githubusercontent.com/7832202/28444721-43eb6ea6-6d8d-11e7-8d56-3af46fd5bf88.png)

## New @ Version 3.0

- Simplified Provider
  - Route and Controller are Optional
- FeatureServer Routes and Handler built in
- Simplified Cache API
  - e.g. [Koop-Cache-Memory](https://github.com/koopjs/koop-cache-memory)
- New Plugin Type: Outputs
  - e.g. [Koop-Output-Geoservices](https://github.com/koopjs/koop-output-geoservices)
  - Handle a set of routes automatically
  - Can call functions on Koop and Provider model
- Simplified Server Configuration
  - Koop now exposes its own Express server at `koop.server`

## Extend Koop

- **Providers**: adapt any third party API our data source to Koop
  - Example: [Koop-Provider-Yelp](https://github.com/koopjs/koop-provider-yelp)
  - Docs: https://koopjs.github.io/docs/usage/provider
- **Outputs**: server data from Koop using any API format like Geoservices, SODA, or WFS
  - Example: [Koop-Output-Geoservices](https://github.com/koopjs/koop-output-geoservices)
- **Caches**: store, process and query GeoJSON
  - Example: [Koop-Cache-Memory](https://github.com/koopjs/koop-cache-memory)
- **Filesytems**: write exported data, tiles and more to disk or to cloud storage like AWS S3
  - Example: [Koop-FileSystem-S3](https://github.com/koopjs/koop-filesystem-s3)
- **Plugins**: extend the Koop API in any way
  - Example [Koop-Queue](https://github.com/koopjs/koop-queue)

## Resources

* [Koop Documentation](https://koopjs.github.io/docs/basics)
* [ArcGIS REST API Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/koopjs/koop/issues).

## Contributing

This repository is a collection of all the official Koop projects. All of the real coding will happen in the linked submodules, so there's no real need to clone or fork *this* repo. If you want to add a new data source to Koop, create a provider. If you want to add features to Koop itself check out [Koop-Core](https://github.com/koopjs/koop-core). Otherwise, check out the different plugin types.

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

## License

[Apache 2.0](LICENSE)

<!-- [](Esri Tags: ArcGIS Web Mapping GeoJson FeatureServices) -->
<!-- [](Esri Language: JavaScript) -->


[npm-img]: https://img.shields.io/npm/v/koop.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koop
[travis-img]: https://img.shields.io/travis/koopjs/koop/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/koopjs/koop
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
