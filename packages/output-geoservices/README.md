# Koop Geoservices Output Plugin

![ https://www.npmjs.com/package/@koopjs/output-geoservices](https://img.shields.io/npm/v/@koopjs/output-geoservices.svg?style=flat-square) ![coverage](https://raw.githubusercontent.com/koopjs/koop/master/packages/output-geoservices/coverage.svg)

Wraps FeatureServer into a [Koop](http://koopjs.github.io) Output plugin.

## Usage
```js
const Koop = require('@koopjs/koop-core')
const config = require('config')
const koop = new Koop(config)
const outputGeoservices = require('@koopjs/output-geoservices')
const provider = require('koop-agol') // any koop provider here

// All output plugins must be registered before any providers are registered
koop.register(outputGeoservices)
koop.register(provider)

koop.server.listen(80)
```

## Options

### `defaults (Object)`
The `defaults` options allows the setting of some FeatureServer metadata properties. The `defaults` option should be an object with some of the following properties:

```js
{
  defaults: {
    currentVersion, // number (11.2)
    fullVersion, // string ('11.2.0')
    maxRecordCount, // number (500)
    server: {
      serviceDescription, // string ('Default text for serviceDescription')
      description, // string ('Default text for description')
      copyrightText, // string ('Default text for copyright')
      hasStaticData, // boolean (true)
      spatialReference, // object (Esri spatial reference)
      initialExtent, // object (Esri spatial envelope)
      fullExtent, // object (Esri spatial envelope)
    },
    layer: {
      description, // string ('Default text for layer description')
      copyrightText, // string ('Default text for layer copyright')
      extent, // object (Esri spatial envelope)
    },
  }
}

```
Note that the `defaults` option only overrides FeatureServer's defaults.  Providers that set metadata may override values set by the above `defaults` properties.


### `useHttpForTokenUrl (boolean)`
The `rest/info` route generates a property `tokenServicesUrl` with value for the URL to use when requesting a token. By default the protocol for this URL is `https`, but if you require it to be `http` set the value of this option to `true`.

```js
{
  useHttpForTokenUrl: true
}
```

### `logger (Logger)`
You can leverage your own custom logger instance, but it must adhere to the Winston logger specification.

```js
{
  logger // some custom Logger instance
}
```

### `includeOwningSystemUrl (boolean)`
If `true`, adds `owningSystemUrl` to the `rest/info` response.  Defaults to false.

## Routes

```js
<provider-namespace>/rest/info
<provider-namespace>/rest/generateToken
<provider-namespace>/rest/services/<provider-path-params>/FeatureServer/:layer/:method
<provider-namespace>/rest/services/<provider-path-params>/FeatureServer/layers
<provider-namespace>/rest/services/<provider-path-params>/FeatureServer/:layer
<provider-namespace>/rest/services/<provider-path-params>/FeatureServer
<provider-namespace>/rest/services/<provider-path-params>/FeatureServer*
<provider-namespace>/rest/services/<provider-path-params>/MapServer*
```