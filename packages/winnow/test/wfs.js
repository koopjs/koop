const test = require('tape')
const run = require('./helper').run

test('WFS with a bbox in Web Mercator with geojson output', t => {
  const options = {
    outputFormat: 'application/json',
    bbox: '-12993071.816030473,3913575.8482084945,-12836528.782102507,4070118.8821364585,EPSG:3857',
    srsName: 'EPSG:3857'
  }
  run('restaurants', options, 249, t)
})
