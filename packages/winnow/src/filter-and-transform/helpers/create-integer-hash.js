const hashFunction = require('./hash-function');

module.exports = function createIntegerHash (inputStr) {
  // Hash to 32 bit unsigned integer
  const hash = hashFunction(inputStr);
  // Normalize to range of postive values of signed integer
  return Math.round((hash / 4294967295) * (2147483647));
};
