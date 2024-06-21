const _ = require('lodash');
function normalizeCapabilities(json) {
  let { capabilities, metadata: { capabilities: metadataCapabilites } = {} } = json;

  capabilities = convertCapabilityToArray(capabilities);

  metadataCapabilites = convertCapabilityToArray(metadataCapabilites);

  const combined = ['Query', ...metadataCapabilites, ...capabilities].map((val) => {
    const lowercase = val.toLowerCase();
    return lowercase[0].toUpperCase() + lowercase.slice(1);
  });
  return Array.from(new Set(combined)).join(', ');
}

function convertCapabilityToArray(capabilities = []) {
  if (Array.isArray(capabilities)) {
    return capabilities;
  }

  if (_.isObject(capabilities)) {
    return Object.entries(capabilities).reduce((acc, [key, val]) => {
      if (val === true) {
        acc.push(key);
      }
      return acc;
    }, []);
  }

  if (_.isString(capabilities)) {
    return capabilities.split(',').map((val) => val.trim());
  }

  return [];
}

module.exports = { normalizeCapabilities };
