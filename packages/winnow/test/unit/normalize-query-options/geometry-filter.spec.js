const test = require('tape')
const normalizeGeometryFilter = require('../../../lib/normalize-query-options/geometry-filter')

test('normalize-query-options, geometry-filter: undefined options input', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter()
  t.equal(geometryFilter, undefined)
})

test('normalize-query-options, geometry-filter: defer to geometry options', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({ geometry: [10, 15, 20, 25], bbox: [0, 45, 50, 90] })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [10, 15],
        [20, 15],
        [20, 25],
        [10, 25],
        [10, 15]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: use bbox if geometry is undefined', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({ bbox: [0, 45, 50, 90] })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [0, 45],
        [50, 45],
        [50, 90],
        [0, 90],
        [0, 45]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: filter spatial reference of 4326 does not trigger reproject', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({ geometry: [0, 45, 50, 90], inSR: 4326 })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [0, 45],
        [50, 45],
        [50, 90],
        [0, 90],
        [0, 45]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: filter spatial reference of 3857 does trigger reproject', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({
    geometry: {
      spatialReference: {
        latestWkid: 3857
      },
      xmin: 782715.169637017,
      ymin: 6569915.455168739,
      xmax: 787607.1394472681,
      ymax: 6574807.42497899
    }
  })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [7.031249999971363, 50.708634400835436],
        [7.0751953124713625, 50.708634400835436],
        [7.0751953124713625, 50.736455137017856],
        [7.031249999971363, 50.736455137017856],
        [7.031249999971363, 50.708634400835436]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: data spatial reference of 3857 triggers reproject of filter', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({
    geometry: {
      spatialReference: {
        latestWkid: 4326
      },
      xmin: 0,
      ymin: 10,
      xmax: 30,
      ymax: 45
    },
    sourceSR: 3857
  })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [0, 1118889.9748579597],
        [3339584.723798207, 1118889.9748579597],
        [3339584.723798207, 5621521.486192066],
        [0, 5621521.486192066],
        [0, 1118889.9748579597]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: same data/filter spatial reference skips filter reprojection', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({
    geometry: {
      spatialReference: {
        latestWkid: 3857
      },
      xmin: 782715.169637017,
      ymin: 6569915.455168739,
      xmax: 787607.1394472681,
      ymax: 6574807.42497899
    },
    sourceSR: 3857
  })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [782715.169637017, 6569915.455168739],
        [787607.1394472681, 6569915.455168739],
        [787607.1394472681, 6574807.42497899],
        [782715.169637017, 6574807.42497899],
        [782715.169637017, 6569915.455168739]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: geometry as coordinate string', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({ geometry: '10,15,20,25' })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [10, 15],
        [20, 15],
        [20, 25],
        [10, 25],
        [10, 15]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: geometry as coordinate array', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({ geometry: [10, 15, 20, 25] })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [10, 15],
        [20, 15],
        [20, 25],
        [10, 25],
        [10, 15]
      ]
    ]
  })
})

test('normalize-query-options, geometry-filter: geometry as Esri envelope', t => {
  t.plan(1)
  const geometryFilter = normalizeGeometryFilter({
    geometry: {
      rings: [
        [
          [-119.86203847085071, 39.545907591418406],
          [-119.86204539539456, 39.545898008841569],
          [-119.86201962858273, 39.545886843071926],
          [-119.86210620156871, 39.545767093994201],
          [-119.86216807184147, 39.545793902806423],
          [-119.86213343971804, 39.545841804116996],
          [-119.86215200336552, 39.545849846100822],
          [-119.86214507417176, 39.545859427834422],
          [-119.86209313222116, 39.545931275663776],
          [-119.86203847085071, 39.545907591418406]
        ]
      ]
    }
  })
  t.deepEquals(geometryFilter, {
    type: 'Polygon',
    coordinates: [
      [
        [-119.8620384708507, 39.545907591418406],
        [-119.86209313222116, 39.545931275663776],
        [-119.86214507417176, 39.54585942783442],
        [-119.86215200336552, 39.54584984610082],
        [-119.86213343971804, 39.545841804116996],
        [-119.86216807184147, 39.54579390280642],
        [-119.86210620156871, 39.5457670939942],
        [-119.86201962858273, 39.545886843071926],
        [-119.86204539539456, 39.54589800884157],
        [-119.8620384708507, 39.545907591418406]
      ]
    ]
  })
})
