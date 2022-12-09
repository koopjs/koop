# Koop

*Translate, query, & integrate any geospatial API on the web*

Koop is a JavaScript toolkit for making requests to spatial APIs. It exposes a Node.js web server that faciliates on-the-fly transformations of geospatial data from one format to another and delivers it to clients by HTTP.  Koop allows you to keep your data in its native format, while making it accessible in any format required.  Out-of-the-box, Koop can translates your data into the GeoServices specification supported by ArcGIS products. It's plugin architecture supports output in other formats including vector-tile, WMS, and plain old GeoJSON. Learn more at [https://koopjs.github.io](https://koopjs.github.io).

Koop's plugin-architecture facilate custom deployments specific to your needs. "Provider" plugins to connect to novel data formats and translate to a common format (GeoJSON), while "output" plugins then transform that GeoJSON to other specifications. See a list of plugins already authored and maintained [here](https://koopjs.github.io/docs/available-plugins). If you have a novel datasource or require an as-yet unsupported output format, new plugins can be easily developed and integrated. See the [development section of the Koop docs](https://koopjs.github.io/docs/development).

![lots of geojson into feature services](https://user-images.githubusercontent.com/7832202/28444721-43eb6ea6-6d8d-11e7-8d56-3af46fd5bf88.png)

## Koop Monorepo
This repository is home of the Koop monorepo.  In contains a collection of packages that are shipped by default with every Koop instance.  [koop-core](https://github.com/koopjs/koop/packages/koop-core) is the parent package and is used to generate a default configuration of Koop. References to the "Koop version" refer to the version of this package. The other packages in this monorepo are dependencies of koop-core and include the Geoservices output-plugin and its dependencies, the default in-memory data cache, and a logger.  All other plugins (providers, outputs, etc) are in separate repositories.

The Koop dependency graph is shown below.
![Screen Shot 2022-11-30 at 1 03 46 PM](https://user-images.githubusercontent.com/4369192/204908289-82659cfe-fcf3-404a-aa70-79baf540f1b8.png)

## Contributing
Pull requests are welcomed and encouraged. Please consider the following PR guidelines:
1. Provide a clear description of what the PR is trying to solve.  Link to any existing issues
2. Aim for clear, readable code.
3. Use conventional commit messages. For convenience, you can add commits with `npm run commit`.
3. Add unit tests and ensure any new code has 100% test coverage. You can do this by running `npm run test:cov` and then looking for your file in the `/coverage/index.html` output.
4. Run `npm run lint:fix` and ensure you're not commiting lint
5. If your new code requires a release, please run `npm run changeset:add` and commit the generated changeset file as a part of your PR.

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/contributing).

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

