const should = require('should'); // eslint-disable-line
const {
  createColorRamp
} = require('./color-ramp');

const classification = [
  [80, 147],
  [147, 174],
  [174, 195],
  [195, 218],
  [240, 270],
  [307, 360],
  [360, 558],
  [558, 799],
  [799, 2000]
];

describe('when creating a color ramp that', () => {
  describe('is algorithmic', () => {
    it('should throw an error on no breaks option', () => {
      createColorRamp.bind().should.throw();
    });

    it('should throw an error on invalid type option', () => {
      createColorRamp.bind(null, { classification, type: 'foo' }).should.throw();
    });

    it('should throw an error on multipart type with color-ramps', () => {
      createColorRamp.bind(null, { classification, type: 'multipart' }).should.throw();
    });

    it('should return correct hsv color ramp', () => {
      const response = createColorRamp({
        classification,
        type: 'algorithmic',
        fromColor: [0, 255, 0],
        toColor: [0, 0, 255],
        algorithm: 'esriHSVAlgorithm'
      });
      response.should.deepEqual([
        [0, 255, 0],
        [0, 255, 64],
        [0, 255, 128],
        [0, 255, 191],
        [0, 255, 255],
        [0, 191, 255],
        [0, 127, 255],
        [0, 64, 255],
        [0, 0, 255]
      ]);
    });

    it('should return correct lab color ramp', () => {
      const response = createColorRamp({
        classification,
        type: 'algorithmic',
        fromColor: [0, 255, 0],
        toColor: [0, 0, 255],
        algorithm: 'esriCIELabAlgorithm'
      });
      response.should.deepEqual([
        [0, 255, 0],
        [87, 228, 79],
        [111, 201, 114],
        [123, 174, 141],
        [125, 147, 166],
        [121, 120, 189],
        [108, 91, 211],
        [83, 58, 233],
        [0, 0, 255]
      ]);
    });

    it('should return correct lch color ramp', () => {
      const response = createColorRamp({
        classification,
        type: 'algorithmic',
        fromColor: [0, 255, 0],
        toColor: [0, 0, 255],
        algorithm: 'esriLabLChAlgorithm'
      });
      response.should.deepEqual([
        [0, 255, 0],
        [0, 242, 105],
        [0, 225, 173],
        [0, 206, 237],
        [0, 186, 255],
        [0, 163, 255],
        [0, 135, 255],
        [0, 96, 255],
        [0, 0, 255]
      ]);
    });

    it('should return multiple color ramps', () => {
      const multipartRamp = {
        type: 'multipart',
        colorRamps: [
          {
            type: 'algorithmic',
            fromColor: [0, 255, 0],
            toColor: [0, 0, 255],
            algorithm: 'esriHSVAlgorithm'
          },
          {
            type: 'algorithmic',
            fromColor: [0, 255, 0],
            toColor: [0, 0, 255],
            algorithm: 'esriCIELabAlgorithm'
          },
          {
            type: 'algorithmic',
            fromColor: [0, 255, 0],
            toColor: [0, 0, 255],
            algorithm: 'esriLabLChAlgorithm'
          }
        ]
      };
      const response = createColorRamp({ classification, ...multipartRamp });
      response.should.deepEqual([
        [
          [0, 255, 0],
          [0, 255, 64],
          [0, 255, 128],
          [0, 255, 191],
          [0, 255, 255],
          [0, 191, 255],
          [0, 127, 255],
          [0, 64, 255],
          [0, 0, 255]
        ],
        [
          [0, 255, 0],
          [87, 228, 79],
          [111, 201, 114],
          [123, 174, 141],
          [125, 147, 166],
          [121, 120, 189],
          [108, 91, 211],
          [83, 58, 233],
          [0, 0, 255]
        ],
        [
          [0, 255, 0],
          [0, 242, 105],
          [0, 225, 173],
          [0, 206, 237],
          [0, 186, 255],
          [0, 163, 255],
          [0, 135, 255],
          [0, 96, 255],
          [0, 0, 255]
        ]
      ]);
    });
  });
});
