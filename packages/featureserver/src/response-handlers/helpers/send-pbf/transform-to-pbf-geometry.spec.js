const should = require('should'); // eslint-disable-line
const { transformToPbfGeometry } = require('./transform-to-pbf-geometry');

const defaultTransform = {
  scale: {
    xScale: 0.0001,
    yScale: 0.0001
  },//[0.0001, 0.0001],
  translate: {
    xTranslate: -20037700,
    yTranslate: -30241100
  } // [-20037700, -30241100],
};

describe('transformToPbfGeometry', () => {
  describe('null geometry', () => {
    it('should return null', () => {
      const fixture = null;
      const result = transformToPbfGeometry(fixture, defaultTransform);
      should.equal(result, null);
    });
  });

  describe('unknown geometry', () => {
    it('should throw', () => {
      const fixture = {};
      try {
        const result = transformToPbfGeometry(fixture, defaultTransform);
        should.equal(result, null);
      } catch (error) {
        error.message.should.equal('Unknown geometry type: {}');
      }
    });
  });

  describe('point geometry', () => {
    it('should quantize and format for pbf buffer', () => {
      const fixture = {
        x: -8571657.3541762847,
        y: 4704411.394312229,
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        coords: ['114660426458', '-349455113943'],
      });
    });

    it('should quantize and format for pbf buffer with Z and M', () => {
      const fixture = {
        x: -8571657.3541762847,
        y: 4704411.394312229,
        z: 100,
        m: 25.3
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        coords: ['114660426458', '-349455113943', '100', '25.3'],
      });
    });

  });

  describe('line geometry', () => {
    it('should quantize and format (minimizing required coords) for pbf buffer', () => {
      const fixture = {
        paths: [
          [
            [-13580977.8767794, 5465442.18332275],
            [-13580977.8767794, 5465442.18332275],
            [-13247019.4043996, 5465442.18332275],
            [-13024380.422813, 5311971.84694547],
          ],
        ],
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        lengths: [3],
        coords: [
          '64567221232',
          '-357065421833',
          '3339584724',
          '0',
          '2226389816',
          '1534703364',
        ],
      });
    });

    it('should quantize and format for pbf buffer', () => {
      const fixture = {
        paths: [
          [
            [-13463923.910264086, 5922952.447761737],
            [-13522627.547987102, 6029352.791134704],
            [-13476153.834789714, 6047697.677923147],
          ],
        ],
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        lengths: [3],
        coords: [
          '65737760897',
          '-361640524478',
          '-587036377',
          '-1064003433',
          '464737132',
          '-183448868',
        ],
      });
    });
  });

  describe('polygon geometry', () => {
    it('should quantize and format (minimizing required coords) for pbf buffer', () => {
      const fixture = {
        rings: [
          [
            [-13469658.3859861, 6106854.83488507],
            [-13469658.3859861, 5942074.07243111],
            [-13580977.8767794, 5942074.07243111],
            [-13580977.8767794, 6106854.83488507],
            [-13469658.3859861, 6106854.83488507],
          ],
        ],
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        lengths: [5],
        coords: [
          '65680416140',
          '-363479548349',
          '0',
          '1647807625',
          '-1113194908',
          '0',
          '0',
          '-1647807625',
          '1113194908',
          '0',
        ],
      });
    });
  });

  describe('multipoint geometry', () => {
    it('should quantize and format for pbf buffer', () => {
      const fixture = {
        points: [
          [-13358338.8951928, 5621521.48619207],
          [-13247019.4043996, 5780349.22025635],
        ],
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        lengths: [2],
        coords: ['66793611048', '-358626214862', '1113194908', '-1588277341'],
      });
    });
  });

  describe('multiline geometry', () => {
    it('should quantize and format for pbf buffer', () => {
      const fixture = {
        paths: [
          [
            [-13803616.8583659, 5621521.48619207],
            [-13358338.8951928, 5621521.48619207],
            [-13358338.8951928, 5942074.07243111],
          ],
          [
            [-13803616.8583659, 5160979.44404978],
            [-13358338.8951928, 5160979.44404978],
          ],
        ],
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        lengths: [3, 2],
        coords: [
          '62340831416',
          '-358626214862',
          '4452779632',
          '0',
          '0',
          '-3205525862',
          '62340831416',
          '-354020794440',
          '4452779632',
          '0',
        ],
      });
    });
  });

  describe('multipolygon geometry', () => {
    it('should quantize and format for pbf buffer', () => {
      const fixture = {
        rings: [
          [
            [-11243268.5701206, 4439106.78725058],
            [-11243268.5701206, 4579425.8128701],
            [-11020629.5885341, 4579425.8128701],
            [-11020629.5885341, 4439106.78725058],
            [-11243268.5701206, 4439106.78725058],
          ],
          [
            [-10797990.6069475, 4163881.14406429],
            [-10797990.6069475, 4300621.37204427],
            [-10575351.625361, 4300621.37204427],
            [-10575351.625361, 4163881.14406429],
            [-10797990.6069475, 4163881.14406429],
          ],
        ],
      };
      const result = transformToPbfGeometry(fixture, defaultTransform);
      result.should.deepEqual({
        lengths: [5, 5],
        coords: [
          '87944314299',
          '-346802067873',
          '0',
          '-1403190256',
          '2226389816',
          '0',
          '0',
          '1403190256',
          '-2226389816',
          '0',
          '92397093931',
          '-344049811441',
          '0',
          '-1367402279',
          '2226389815',
          '0',
          '0',
          '1367402279',
          '-2226389815',
          '0',
        ],
      });
    });
  });
});
