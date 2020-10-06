const test = require('tape')
const filterAndTransform = require('../../../lib/filter-and-transform')
const polygonFilter = {
  type: 'Polygon',
  coordinates: [
    [
      [
        -56.9,
        -61.8
      ],
      [
        -52.9,
        -61.8
      ],
      [
        -52.9,
        -60.5
      ],
      [
        -56.9,
        -60.5
      ],
      [
        -56.9,
        -61.8
      ]
    ]
  ]
}
const pointFeature = {
  type: 'Point',
  coordinates: [
    -55.1,
    -61.1
  ]
}
const lineFeature = {
  type: 'LineString',
  coordinates: [
    [
      -54.5,
      -60.7
    ],
    [
      -54.7,
      -60.8
    ]
  ]
}
const polygonFeature = {
  type: 'Polygon',
  coordinates: [
    [
      [
        -54.3,
        -61.3
      ],
      [
        -53.9,
        -61.3
      ],
      [
        -53.9,
        -60.7
      ],
      [
        -54.3,
        -61.3
      ]
    ]
  ]
}

test('sql.fn.ST_Within - geometries fully within a target polygon should return true', t => {
  t.plan(3)
  t.ok(filterAndTransform.fn.ST_Within(pointFeature, polygonFilter), 'point within filter geom')
  t.ok(filterAndTransform.fn.ST_Within(lineFeature, polygonFilter), 'line within filter geom')
  t.ok(filterAndTransform.fn.ST_Within(polygonFeature, polygonFilter), 'polygon within filter geom')
})

test('sql.fn.ST_Within - falsey feature geometries should return false', t => {
  const falseyFeatures = [undefined, null, {}, { coordinates: [] }, { coordinates: [0, 0] }, { type: 'Point' }]

  falseyFeatures.forEach(falsey => {
    t.notOk(filterAndTransform.fn.ST_Within(falsey, polygonFilter), 'falsey feature should return false')
  })
  t.end()
})

// TODO: put other method decorators under test
