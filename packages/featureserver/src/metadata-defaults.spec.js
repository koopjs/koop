const should = require('should'); // eslint-disable-line
const defaults = require('./metadata-defaults');

describe('server config options', () => {
  afterEach(() => {
    defaults.reset();
  });

  it('should set and get options', () => {
    defaults.setDefaults({ currentVersion: 99.1 });
    const settings = defaults.serverDefaults();
    settings.currentVersion.should.equal(99.1);
  });

  it('should not be able to set invalid values', () => {
    try {
      const result = defaults.setDefaults({ server: { spatialReference: {} } });
      result.should.be.undefined();
    } catch (error) {
      error.message.should.equal(
        'FeatureServer default settings are invalid: "server.spatialReference.wkid" is required.',
      );
    }
  });

  it('should ignore unknown keys', () => {
    defaults.setDefaults({ foo: 'bar' });
    const settings = defaults.serverDefaults();
    settings.foo?.should.be.undefined();
  });
});
