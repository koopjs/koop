module.exports = {
  parse: function (spatialRef) {
    if (typeof spatialRef === 'string') {
      return JSON.parse(spatialRef).wkid
    }

    if (typeof spatialRef == 'object') {
      return spatialRef.wkid
    }

    return spatialRef
  }
}
