# Koop

*Translate, query, & integrate any geospatial API on the web*

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![js-standard-style][standard-img]][standard-url]

Koop is a JavaScript toolkit for making requests to spatial APIs. It exposes a Node.js web server that faciliates on-the-fly transformations of geospatial data from one format to another and delivers it to clients by HTTP.  Koop allows you to keep your data in its native format, while making it accessible in any format required.  Out-of-the-box, Koop can translates your data into the GeoServices specification supported by ArcGIS products. It's plugin architecture supports output in other formats including vector-tile, WMS, and plain old GeoJSON. Learn more at [https://koopjs.github.io](https://koopjs.github.io).

Koop's plugin-architecture facilate custom deployments specific to your needs. "Provider" plugins to connect to novel data formats and translate to a common format (GeoJSON), while "output" plugins then transform that GeoJSON to other specifications. See a list of plugins already authored and maintained [here](https://koopjs.github.io/docs/available-plugins). If you have a novel datasource or require an as-yet unsupported output format, new plugins can be easily developed and integrated. See the [development section of the Koop docs](https://koopjs.github.io/docs/development).

![lots of geojson into feature services](https://user-images.githubusercontent.com/7832202/28444721-43eb6ea6-6d8d-11e7-8d56-3af46fd5bf88.png)

## Koop Monorepo
This repository is home of the Koop Monorepo.  In contains a collection of packages that are employed by every Koop instance.  [koop-core](https://github.com/koopjs/koop/packages/koop-core) is the parent package and is used to generate a default configuration of Koop. References to the "Koop version" refer to the version of this package. 

The other packages in this monorepo are dependencies of koop-core and include the Geoservices output-plugin and its dependencies, the default in-memory data cache, and a logger.  All other plugins (providers, outputs, etc) are in separate repositories.

## Issues
Find a bug or want to request a new feature? If you are new to Koop and have an issue but are not sure which repository it should be attached to, feel free to post it [here](https://github.com/koopjs/koop/issues)..  Otherwise, post the issue to its originating repository.

## Resources

* [Koop Documentation](https://koopjs.github.io/)
* [ArcGIS REST API Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [@esri](http://twitter.com/esri)

## Contributing

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
