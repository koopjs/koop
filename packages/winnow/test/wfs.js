const test = require('tape')
const run = require('./helper').run
const winnow = require('../src')

test('WFS with a bbox in Web Mercator with geojson output', t => {
  const options = {
    outputFormat: 'application/json',
    bbox: '-12993071.816030473,3913575.8482084945,-12836528.782102507,4070118.8821364585,EPSG:3857',
    srsName: 'EPSG:3857'
  }
  run('restaurants', options, 249, t)
})

test('WFS with a bbox in Web Mercator with geojson output', t => {
  t.plan(2)
  const options = {
    outputFormat: 'application/json',
    bbox: '-12993071.816030473,3913575.8482084945,-12836528.782102507,4070118.8821364585,EPSG:3857',
    srsName: 'EPSG:3857',
    count: 1
  }
  const features = require('./fixtures/restaurants.json')
  const filtered = winnow.query(features, options)
  const coords = filtered.features[0].geometry.coordinates
  t.equal(coords[0], -12978087.878608154, 'projected correctly')
  t.equal(filtered.features.length, 1, 'limited correctly')
})
