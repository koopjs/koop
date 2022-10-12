function toHash (value, hashStore = {}) {
  if (hashStore[value]) hashStore[value]++;
  else hashStore[value] = 1;
  return hashStore;
}

module.exports = toHash;
