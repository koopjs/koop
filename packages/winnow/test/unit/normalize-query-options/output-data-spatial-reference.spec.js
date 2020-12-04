const test = require('tape')
const normalizeOutputDataSpatialReference = require('../../../lib/normalize-query-options/output-data-spatial-reference')

test('normalize-query-options, output-data-spatial-reference: undefined input', t => {
  t.plan(1)
  const { wkid } = normalizeOutputDataSpatialReference()
  t.equal(wkid, 4326)
})

test('normalize-query-options, output-data-spatial-reference: undefined options', t => {
  t.plan(1)
  const { wkid } = normalizeOutputDataSpatialReference({})
  t.equal(wkid, 4326)
})

test('normalize-query-options, output-data-spatial-reference: defer to projection option', t => {
  t.plan(1)
  const options = {
    projection: 4326,
    srsname: 4269,
    srsName: 3857,
    outSR: 2227
  }
  const { wkid } = normalizeOutputDataSpatialReference(options)
  t.equal(wkid, 4326)
})

test('normalize-query-options, output-data-spatial-reference: defer to srsname option', t => {
  t.plan(1)
  const options = {
    srsname: 4269,
    srsName: 3857,
    outSR: 2227
  }
  const { wkid } = normalizeOutputDataSpatialReference(options)
  t.equal(wkid, 4269)
})

test('normalize-query-options, output-data-spatial-reference: defer to srsName option', t => {
  t.plan(1)
  const options = {
    srsName: 3857,
    outSR: 2227
  }
  const { wkid } = normalizeOutputDataSpatialReference(options)
  t.equal(wkid, 3857)
})

test('normalize-query-options, output-data-spatial-reference: defer to outSR option', t => {
  t.plan(2)
  const options = {
    outSR: 2227
  }
  const { wkid, wkt } = normalizeOutputDataSpatialReference(options)
  t.equal(wkid, 2227)
  t.equal(wkt, 'PROJCS["NAD_1983_StatePlane_California_III_FIPS_0403_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",6561666.666666666],PARAMETER["False_Northing",1640416.666666667],PARAMETER["Central_Meridian",-120.5],PARAMETER["Standard_Parallel_1",37.06666666666667],PARAMETER["Standard_Parallel_2",38.43333333333333],PARAMETER["Latitude_Of_Origin",36.5],UNIT["Foot_US",0.3048006096012192]]')
})

test('normalize-query-options, output-data-spatial-reference: bad input', t => {
  t.plan(1)
  const options = {
    outSR: 99999
  }
  const { wkid } = normalizeOutputDataSpatialReference(options)
  t.equal(wkid, 4326)
})
