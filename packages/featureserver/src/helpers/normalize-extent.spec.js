const should = require('should');
const { normalizeExtent } = require('.');

describe('normalize-extent', function () {
  it('undefined input should return undefined', () => {
    const result = normalizeExtent();
    should(result).equal(undefined);
  });

  it('string input should throw error', () => {
    try {
      normalizeExtent('string');
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: "string"');
    }
  });

  it('empty array input should throw error', () => {
    try {
      normalizeExtent([]);
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: []');
    }
  });

  it('simple extent array with less than required coordinates should throw error', () => {
    try {
      normalizeExtent([-180, -90, 180], { wkid: 4326 });
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: [-180,-90,180]');
    }
  });

  it('simple extent array with NaNs should throw error', () => {
    try {
      normalizeExtent([-180, -90, 180, 'foo'], { wkid: 4326 });
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: [-180,-90,180,"foo"]');
    }
  });

  it('simple extent array should return Esri Extent', () => {
    const result = normalizeExtent([-180, -90, 180, 90], { wkid: 4326 });
    result.should.deepEqual({
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
      spatialReference: { wkid: 4326 },
    });
  });

  it('uses only first four elements of simple extent array', () => {
    const result = normalizeExtent([-180, -90, 180, 90, 3857], { wkid: 4326 });
    result.should.deepEqual({
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
      spatialReference: { wkid: 4326 },
    });
  });

  it('empty corner array should throw error', () => {
    try {
      normalizeExtent([[], []], { wkid: 4326 });
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: [[],[]]');
    }
  });

  it('corner array with missing coordinates should throw error', () => {
    try {
      normalizeExtent([[3], [4]], { wkid: 4326 });
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: [[3],[4]]');
    }
  });

  it('corner array with NaNs should throw error', () => {
    try {
      normalizeExtent(
        [
          [3, 'food'],
          [4, 5],
        ],
        { wkid: 4326 },
      );
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: [[3,"food"],[4,5]]');
    }
  });

  it('corner array with too many coordinates should throw error', () => {
    try {
      normalizeExtent(
        [
          [3, 5, 7],
          [4, 5],
        ],
        { wkid: 4326 },
      );
      should.fail();
    } catch (error) {
      error.message.should.equal('Received invalid extent: [[3,5,7],[4,5]]');
    }
  });

  it('corner extent array should return Esri Extent', () => {
    const result = normalizeExtent(
      [
        [-180, -90],
        [180, 90],
      ],
      { wkid: 4326 },
    );
    result.should.deepEqual({
      xmin: -180,
      ymin: -90,
      xmax: 180,
      ymax: 90,
      spatialReference: { wkid: 4326 },
    });
  });

  it('Complete Esri extent passed in should get returned', () => {
    const result = normalizeExtent(
      {
        xmin: 40,
        ymin: 10,
        xmax: 55,
        ymax: 25,
        spatialReference: {
          wkid: 4326,
        },
      },
      {
        wkid: 3857,
      },
    );
    result.should.deepEqual({
      xmin: 40,
      ymin: 10,
      xmax: 55,
      ymax: 25,
      spatialReference: { wkid: 4326 },
    });
  });

  it('Esri extent without spatial ref, should get spatial ref added', () => {
    const result = normalizeExtent(
      {
        xmin: 40,
        ymin: 10,
        xmax: 55,
        ymax: 25,
      },
      {
        wkid: 4326,
      },
    );
    result.should.deepEqual({
      xmin: 40,
      ymin: 10,
      xmax: 55,
      ymax: 25,
      spatialReference: { wkid: 4326 },
    });
  });
});
