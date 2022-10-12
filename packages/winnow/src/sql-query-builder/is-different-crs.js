module.exports = function isDifferentCrs (inputCrs = {}, outputCrs = {}) {
  return inputCrs.wkid !== outputCrs.wkid || inputCrs.wkt !== outputCrs.wkt;
};
