const _ = require('lodash')
const chroma = require('chroma-js')

module.exports = { createColorRamp }

const renderers = {
  algorithmicColorRamp: require('../../templates/renderers/symbology/algorithmicColorRamp.json')
}

function createColorRamp (breaks, inputRamp) {
  if (!breaks || breaks.length === 0) throw new Error('Must supply breaks')
  const rampOptions = {
    rampDetails: inputRamp || _.cloneDeep(renderers.algorithmicColorRamp),
    breakCount: breaks.length
  }
  const type = rampOptions.rampDetails.type
  if (type === 'multipart' && rampOptions.rampDetails.colorRamps) return createMultipartRamp(rampOptions)
  else if (type === 'algorithmic') return createAlgorithmicRamp(rampOptions)
  else throw new Error('Invalid color ramp type: ', rampOptions.rampDetails.type)
}

/**
*
* generate multipart color ramp
*
* @param {array} options
* @return {array} algorithmic colorRamps
*/
function createMultipartRamp (options) {
  // TODO: determine if we even need multipart ramps. If so, finish & write tests
  const { rampDetails, breakCount = 7 } = options
  const type = rampDetails.type
  const colorRamps = rampDetails.colorRamps

  if (type !== 'multipart' && colorRamps.length < 1) return
  return colorRamps.map((currentRamp) => {
    const rampOptions = {
      rampDetails: currentRamp,
      breakCount: breakCount
    }
    return createAlgorithmicRamp(rampOptions)
  })
}

/**
*
* generate algorithmic color ramp
*
* @param {array} options
* @return {array} colorRamp
*/
function createAlgorithmicRamp (options) {
  const { rampDetails, breakCount } = options
  if (rampDetails.type !== 'algorithmic') return
  const colorRamp = chroma.scale([rampDetails.fromColor.slice(0, 3), rampDetails.toColor.slice(0, 3)])
  switch (rampDetails.algorithm) {
    case 'esriHSVAlgorithm': // using HSV & hsl interchangeably
      return colorRamp.mode('hsl').colors(breakCount, 'rgb')
    case 'esriCIELabAlgorithm':
      return colorRamp.mode('lab').colors(breakCount, 'rgb')
    case 'esriLabLChAlgorithm':
      return colorRamp.mode('lch').colors(breakCount, 'rgb')
    default:
      return colorRamp.mode('hsl').colors(breakCount, 'rgb')
  }
}
