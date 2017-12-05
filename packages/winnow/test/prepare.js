const test = require('tape')
const Winnow = require('../src')

test('compiling a complex query', t => {
  try {
    t.ok(Winnow.prepareQuery({
      geometry: {
        xmin: -37237674.195623085,
        ymin: 676003.5082798181,
        xmax: 37237674.195623085,
        ymax: 12416731.052879848,
        spatialReference: {
          wkt: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
        }
      }
    }), 'query compiled')
    t.end()
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('compiling with several and statements', t => {
  try {
    t.ok(Winnow.prepareQuery({where: 'ELEVATION >= 1165 AND ELEVATION <= 4365 AND POP1990 >= 8247 AND POP1990 <= 5700236'}))
    t.end()
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
