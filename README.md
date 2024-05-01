# Koop

*Translate, query, & integrate any geospatial API on the web*

Koop is a JavaScript toolkit for making requests to spatial APIs. It exposes a Node.js web server that faciliates on-the-fly transformations of geospatial data from one format to another and delivers it to clients by HTTP.  Koop allows you to keep your data in its native format, while making it accessible in any format required.  Out-of-the-box, Koop can translates your data into the GeoServices specification supported by ArcGIS products. It's plugin architecture supports output in other formats including vector-tile, WMS, and plain old GeoJSON. Learn more at [https://koopjs.github.io](https://koopjs.github.io).

Koop's plugin-architecture facilates custom deployments specific to your needs. "Provider" plugins to connect to novel data formats and translate to a common format (GeoJSON), while "output" plugins then transform that GeoJSON to other specifications. See a list of plugins already authored and maintained [here](https://koopjs.github.io/docs/available-plugins). If you have a novel datasource or require an as-yet unsupported output format, new plugins can be easily developed and integrated. See the [development section of the Koop docs](https://koopjs.github.io/docs/development).

![lots of geojson into feature services](https://user-images.githubusercontent.com/7832202/28444721-43eb6ea6-6d8d-11e7-8d56-3af46fd5bf88.png)

## Demo
Want to see Koop in action? The repository ships with a demo that shows Koops support for GeoServices (ArcGIS). It leverages the file-geojson data provider and the GeoServices output-plugin:

```bash
git clone https://github.com/koopjs/koop
cd koop
npm run demo
```

Koop will start listening on port 8080. You should the following console logging noting the exposed file-geojson/GeoService routes:

```bash
2023-03-17T19:18:29.416Z info: [Geoservices] routes for [file-geojson] provider
2023-03-17T19:18:29.416Z info: ROUTE | [GET, POST] | /file-geojson/rest/info
2023-03-17T19:18:29.416Z info: ROUTE | [GET, POST] | /file-geojson/tokens/:method
2023-03-17T19:18:29.417Z info: ROUTE | [GET, POST] | /file-geojson/tokens
2023-03-17T19:18:29.417Z info: ROUTE | [GET, POST] | /file-geojson/rest/services/:id/FeatureServer/:layer/:method
2023-03-17T19:18:29.417Z info: ROUTE | [GET, POST] | /file-geojson/rest/services/:id/FeatureServer/layers
2023-03-17T19:18:29.417Z info: ROUTE | [GET, POST] | /file-geojson/rest/services/:id/FeatureServer/:layer
2023-03-17T19:18:29.417Z info: ROUTE | [GET, POST] | /file-geojson/rest/services/:id/FeatureServer
2023-03-17T19:18:29.417Z info: ROUTE | [GET, POST] | /file-geojson/rest/services/:id/FeatureServer*
```

The following request will take the demo data from `demo/provider-data/line.geojson` and send it as geojson:

```
http://localhost:8080/file-geojson/rest/services/line/FeatureServer/0/query
```

Query for features with a specific property value:

```
http://localhost:8080/file-geojson/rest/services/line/FeatureServer/0/query?where=foo='bar'
```

Return data in a different coordinate system:

```
http://localhost:8080/file-geojson/rest/services/line/FeatureServer/0/query?outSR=3857
```

## Koop Monorepo

This repository is home of the Koop monorepo.  In contains a collection of packages that are shipped by default with every Koop instance.  [koop-core](https://github.com/koopjs/koop/packages/core) is the parent package and is used to generate a default configuration of Koop. References to the "Koop version" refer to the version of this package. The other packages in this monorepo are dependencies of core and include the Geoservices output-plugin and its dependencies, the default in-memory data cache, and a logger.  All other plugins (providers, outputs, etc) are in separate repositories.

The Koop dependency graph is shown below.
![Screen Shot 2022-11-30 at 1 03 46 PM](https://user-images.githubusercontent.com/4369192/204908289-82659cfe-fcf3-404a-aa70-79baf540f1b8.png)

### Test Coverage
Test coverages for each package are shown below. Coverage for winnow package includes integration tests as opposed to true unit tests. Our goal is to have complete unit test coverage, and breakout integration/e2e tests separately.

| package | integration + unit | unit |
|---|---|---|
|cache-memory|N/A|![coverage](./packages/cache-memory/coverage.svg)|
|featureserver|![coverage](./packages/featureserver/coverage.svg)|
|koop-core|N/A|![coverage](./packages/core/coverage.svg)|
|logger|N/A|![coverage](./packages/logger/coverage.svg)|
|output-geoservices|N/A|![coverage](./packages/output-geoservices/coverage.svg)|
|winnow|![coverage](./packages/winnow/coverage.svg)|![coverage](./packages/winnow/coverage-unit.svg)|

## Contributing
See our [contribution](./CONTRIBUTING.md) doc.

## Issues
Find a bug or want to request a new feature? Post it [here](https://github.com/koopjs/koop/issues).

## Resources

* [Koop Documentation](https://koopjs.github.io/)
* [ArcGIS REST API Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [@esri](http://twitter.com/esri)

## License

[Apache 2.0](LICENSE)

<!-- [](Esri Tags: ArcGIS Web Mapping GeoJson FeatureServices) -->
<!-- [](Esri Language: JavaScript) -->
