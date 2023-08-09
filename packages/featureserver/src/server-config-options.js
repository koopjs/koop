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
  'units',
];

class ServerMetadataOptions {
  #options;

  constructor() {
  }

  getOptions () {
    return this.#options || {};
  }

  setOptions(options) {
    if(!this.#options) {
      this.#options = _.pick(options, allowedOptions);
    }
  }

}

const serverMetadataOptions = new ServerMetadataOptions();

module.exports = {
  get: serverMetadataOptions.getOptions.bind(serverMetadataOptions),
  set: serverMetadataOptions.setOptions.bind(serverMetadataOptions),
};
