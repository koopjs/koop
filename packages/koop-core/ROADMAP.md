# Roadmap

This document is meant to provide transparency in planning and implementation goals for the Koop project.

## v2.x / Minor Changes

To be completed in the near future - September/October 2015

### Improvements

#### Error handling, reporting, logging

* https://github.com/koopjs/koop/issues/209
* https://github.com/koopjs/koop/issues/228

#### Better plugin support

https://github.com/koopjs/koop/issues/195

##### make preview routes a plugin

Identical or near-identical JS & HTML is being duplicated across providers for previews. If we improve plugin support enough in v2, we should be able to remove preview code from all providers and make a simple plugin that adds a preview route to every provider. I think this would be a good candidate for designing a better plugin strategy.

### Changes

#### Provider inheritance

via koop-provider module

* https://github.com/koopjs/koop-provider
* https://github.com/koopjs/koopjs.github.io/issues/10

#### Worker & Export manangement

Exporter & ExportWorker should be broken out into separate modules.

## v3

### Removals

* remove from `lib/`: Exporter, ExportWorker, BaseModel, BaseController, FeatureServices, Query, & SpatialReference

These modules will be deprecated in v2 once the koop-provider, koop-exporter, and koop-worker modules are production ready.

--

## Theoretical / tentative discussion

Major API changes:

Provide better support for `plugins`. Right now the model for creating a plugin is pretty poor, as illustrated by https://github.com/koopjs/koop/issues/195.

Move away from `provider` in favor of three new types of plugins: `source`, `export`, and `interface`.

This can be thought of more or less like so:

`server/koop/:source{/**}/:item{.:export,/:interface}`

### Source

Defines methods for extracting data from a third party source and transforming it into standard GeoJSON. Handles registering hosts if necessary.

This definition is looser than a provider in that it encompasses any kind of data source, not just open data providers.

Ideally a `source` plugin is more focused, meaning that

- (b) it is only concerned with the specifics of its data source and how to hand that data over to koop
- (c) it does not interact directly with the koop cache in any way
- (a) it is less tightly coupled to express and has as little knowledge of server requests and responses as necessary

Addresses:

* `lib/` refactor
* better encapsulation
* BaseModel & BaseController issues & limitations

Module naming convention:

```
koop-source-*

e.g.

koop-source-agol
koop-source-socrata
koop-source-ckan
```

Methods:

* extract (internal method, can be used by itself, e.g. `require(koop-source-agol/extract)`)
* transform (internal method, can be used by itself, e.g. `require(koop-source-agol/transform)`)
* fetch (primary method used by koop core to request data from source)

### Export

Defines methods for exporting GeoJSON to a static format. This means KML, CSV, Shapefile, etc. This plugin would exist exclusively to encapsulate logic for downloading data in a specific format.

Addresses:

* Support for TopoJSON ([#199](https://github.com/koopjs/koop/issues/199))
* File Geodatabase support
* Removing ogr2ogr as a dependency for exporting file formats
* `lib/` refactor

Module naming convention:

```
koop-export-*

e.g.

koop-export-geojson
koop-export-topojson
koop-export-shapefile
koop-export-kml
koop-export-csv
```

### Interface

Defines methods for querying GeoJSON via a third-party API. This means Feature Service, Soda2, OData, etc. This requires a lot of refactoring but would yield a lot of benefits and has the potential to set a standard interface for querying GeoJSON.

Addresses:

* Support for OGC [WFS](http://www.opengeospatial.org/standards/wfs) ([#163](https://github.com/koopjs/koop/issues/163))
* Support for OGC [WMS](http://www.opengeospatial.org/standards/wms) ([#164](https://github.com/koopjs/koop/issues/164))
* Support for Soda2 ([#195](https://github.com/koopjs/koop/issues/195))
* Support for OData ([#195](https://github.com/koopjs/koop/issues/195))
* Breaking out Feature Service logic ([#151](https://github.com/koopjs/koop/issues/151))
* `lib/` refactor

Module naming convention:

```
koop-api-*

e.g.

koop-api-featureservice
koop-api-soda2
koop-api-odata
```
