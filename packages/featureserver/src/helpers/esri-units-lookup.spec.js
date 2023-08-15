const should = require('should'); // eslint-disable-line
const esriUnitsLookup = require('./esri-units-lookup');

describe('esriUnitsLookup', () => {
  it('inch', () => {
    const result = esriUnitsLookup('inch');
    result.should.equal('esriInches');
  });

  it('foot', () => {
    const result = esriUnitsLookup('foot');
    result.should.equal('esriFeet');
  });

  it('yard', () => {
    const result = esriUnitsLookup('yard');
    result.should.equal('esriYards');
  });
  
  it('mile', () => {
    const result = esriUnitsLookup('mile');
    result.should.equal('esriMiles');
  });

  it('meter', () => {
    const result = esriUnitsLookup('meter');
    result.should.equal('esriMeters');
  });

  it('metre', () => {
    const result = esriUnitsLookup('metre');
    result.should.equal('esriMeters');
  });

  it('millimeter', () => {
    const result = esriUnitsLookup('millimeter');
    result.should.equal('esriMillimeters');
  });

  it('millimetre', () => {
    const result = esriUnitsLookup('millimetre');
    result.should.equal('esriMillimeters');
  });

  it('centimeter', () => {
    const result = esriUnitsLookup('centimeter');
    result.should.equal('esriCentimeters');
  });

  it('centimetre', () => {
    const result = esriUnitsLookup('centimetre');
    result.should.equal('esriCentimeters');
  });

  it('decimeter', () => {
    const result = esriUnitsLookup('decimetre');
    result.should.equal('esriDecimeters');
  });

  it('decimetre', () => {
    const result = esriUnitsLookup('decimetre');
    result.should.equal('esriDecimeters');
  });

  it('kilometre', () => {
    const result = esriUnitsLookup('kilometre');
    result.should.equal('esriKilometers');
  });

  it('kilometer', () => {
    const result = esriUnitsLookup('kilometer');
    result.should.equal('esriKilometers');
  });

  it('degree', () => {
    const result = esriUnitsLookup('degree');
    result.should.equal('esriDecimalDegrees');
  });
});
