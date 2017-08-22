module.exports = function (input) {
  let coords
  if (!input) return undefined
  if (input.xmin) return input
  if (Array.isArray(input)) {
    if (Array.isArray(input[0])) coords = input
    else coords = [[input[0], input[1]], [input[2], input[3]]]
  } else {
    throw new Error('invalid extent passed in metadata')
  }
  return {
    xmin: coords[0][0],
    ymin: coords[0][1],
    xmax: coords[1][0],
    ymax: coords[1][1],
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  }
}
