# Roadmap

This document is meant to provide transparency in planning and implementation goals for the Koop project.

## v3

Major API changes:

Provide better support for `plugins`. Right now the model for creating a plugin is pretty poor, as illustrated by https://github.com/koopjs/koop/issues/195.

Move away from `provider` in favor of three new types of plugins: `source`, `export`, and `interface`.

This can be thought of more or less like so:

`server/koop/:source/:item{.:export,/:interface}`

### Source

Defines methods for extracting data from a third party source and transforming it into standard GeoJSON.

This definition is looser than a provider in that it encompasses any kind of data source, not just open data providers.

Ideally a `source` plugin is more focused, meaning that

- (b) it is only concerned with the specifics of its data source and how to hand that data over to koop
- (c) it does not interact directly with the koop cache in any way
- (a) it is less tightly coupled to express and has as little knowledge of server requests and responses as necessary

### Export

Defines methods for exporting GeoJSON to a static format. This means KML, CSV, Shapefile, etc. This plugin would exist exclusively to encapsulate logic for downloading data in a specific format.

This would make it easier to support exporting [FGDB](http://www.gdal.org/drv_filegdb.html), and possibly address removing ogr2ogr as a dep for exporting file formats (both previously on the road map).

### Interface

Defines methods for querying GeoJSON via a third-party API. This means Feature Service, Soda2, OData, etc. This requires a lot of refactoring but would yield a lot of benefits and has the potential to set a standard interface for querying GeoJSON.

This would make it easier to support OGC [WMS](http://www.opengeospatial.org/standards/wms) and [WFS](http://www.opengeospatial.org/standards/wfs) (previously on the roadmap).
