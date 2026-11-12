const should = require('should'); // eslint-disable-line
const {
  restInfo,
  serverInfo,
  layerInfo,
  layersInfo,
  query,
  queryRelatedRecords,
  generateRenderer,
  setLogger,
  setDefaults,
} = require('./index');
describe('exposed methods of FeatureServer', () => {
  it('ensure methods are defined', () => {
    restInfo.should.be.a.Function();
    serverInfo.should.be.a.Function();
    layerInfo.should.be.a.Function();
    layersInfo.should.be.a.Function();
    query.should.be.a.Function();
    queryRelatedRecords.should.be.a.Function();
    generateRenderer.should.be.a.Function();
    setLogger.should.be.a.Function();
    setDefaults.should.be.a.Function();
  });
});
