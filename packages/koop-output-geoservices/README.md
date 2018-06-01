# Koop Geoservices Output Plugin

[![npm](https://img.shields.io/npm/v/koop-output-geoservices.svg?style=flat-square)](https://www.npmjs.com/package/koop-output-geoservices)
[![Greenkeeper badge](https://badges.greenkeeper.io/koopjs/koop-output-geoservices.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/koopjs/koop-output-geoservices.svg?branch=master)](https://travis-ci.org/koopjs/koop-output-geoservices)

Wraps [FeatureServer](https://github.com/featureserver/featureserver) into a [Koop](http://koopjs.github.io) Output plugin.

## Usage
```js
const Koop = require('koop')
const config = require('config')
const koop = new Koop(config)
const FeatureServer = require('koop-output-geoservices')
const Provider = require('koop-agol') // any koop provider here

// All output plugins must be registered before any providers are registered
koop.register(FeatureServer)
koop.register(Provider)

koop.server.listen(80)
```

## Routes

```js
Geoservices.routes = [
  {
    path: '$namespace/rest/info',
    methods: ['get', 'post'],
    handler: 'featureServerRestInfo'
  },
  {
    path: '$namespace/tokens/:method',
    methods: ['get', 'post'],
    handler: 'generateToken'
  },
  {
    path: '$namespace/tokens/',
    methods: ['get', 'post'],
    handler: 'generateToken'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/:layer/:method',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/:layer/:method',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/layers',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer/:layer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/FeatureServer*',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'FeatureServer*',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: '$namespace/rest/services/$providerParams/MapServer*',
    methods: ['get', 'post'],
    handler: 'featureServer'
  },
  {
    path: 'MapServer*',
    methods: ['get', 'post'],
    handler: 'featureServer'
  }
]
```
