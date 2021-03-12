const should = require('should') // eslint-disable-line
const getCollectionCrs = require('../../../lib/helpers/get-collection-crs')

describe('get-collection-crs', () => {
  it('getCollectionCrs: no collection', () => {
    const crs = getCollectionCrs()
    should(crs).equal(undefined)
  })

  it('getCollectionCrs: no crs', () => {
    const crs = getCollectionCrs({})
    should(crs).equal(undefined)
  })

  it('getCollectionCrs: no crs', () => {
    const crs = getCollectionCrs({})
    should(crs).equal(undefined)
  })

  it('getCollectionCrs: no crs object', () => {
    const crs = getCollectionCrs({ crs: {} })
    should(crs).equal(undefined)
  })

  it('getCollectionCrs: bad crs definition', () => {
    const crs = getCollectionCrs({ crs: { properties: { name: 'foodbar' } } })
    should(crs).equal(undefined)
  })

  it('getCollectionCrs: WGS84 definition', () => {
    const crs = getCollectionCrs({ crs: { properties: { name: 'urn:ogc:def:crs:ogc:1.3:crs84' } } })
    should(crs).equal(undefined)
  })

  it('getCollectionCrs: non-WGS84 definition', () => {
    const crs = getCollectionCrs({ crs: { properties: { name: 'urn:ogc:def:crs:EPSG::2285' } } })
    should(crs).equal('2285')
  })
})
