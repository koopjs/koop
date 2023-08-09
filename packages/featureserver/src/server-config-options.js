const _ = require('lodash');
const allowedOptions = [
  'currentVersion',
  'serviceDescription',
  'description',
  'maxRecordCount',
  'copyrightText',
  'spatialReference',
  'initialExtent',
  'fullExtent',
  'hasStaticData',
];

class ServerConfigOptions {
  #options;

  constructor() {
  }

  getOptions () {
    return this.#options || {};
  }

  setOptions(options) {
    if(!this.#options) {
      this.#options = _.pick(options, allowedOptions);
      return;
    }
  }
}

const serverMetadataOptions = new ServerConfigOptions();

module.exports = {
  get: serverMetadataOptions.getOptions.bind(serverMetadataOptions),
  set: serverMetadataOptions.setOptions.bind(serverMetadataOptions),
};
