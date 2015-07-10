// more methods than just parse will be here eventually
module.exports = {

  // parses variations of spatial refs into a standard structure
  parse: function (spatialRef) {

    if (typeof spatialRef === 'string') {
      try {
        return JSON.parse(spatialRef)
      } catch (e) {
        return spatialRef
      }
    }

    if (typeof spatialRef === 'number') {
      return {wkid: spatialRef}
    }

    return spatialRef
  }
}
