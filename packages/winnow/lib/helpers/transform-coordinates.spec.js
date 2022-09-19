const test = require('tape');
const transformCoordinates = require('./transform-coordinates');

test('transform coordinates, point', t => {
  t.plan(1);
  const transform = (coordinates) => {
    coordinates[0] = 'x';
    coordinates[1] = 'y';
  };
  const input = [100.0, 0.0];
  transformCoordinates(input, {}, transform);
  t.deepEquals(input, ['x', 'y']);
});

test('transform coordinates, line', t => {
  t.plan(1);
  const transform = (coordinates) => {
    coordinates[0] = 'x';
    coordinates[1] = 'y';
  };
  const input = [
    [100.0, 0.0],
    [101.0, 1.0]
  ];
  transformCoordinates(input, {}, transform);
  t.deepEquals(input, [['x', 'y'], ['x', 'y']]);
});

test('transform coordinates, polygon', t => {
  t.plan(1);
  const transform = (coordinates) => {
    coordinates[0] = 'x';
    coordinates[1] = 'y';
  };
  const input = [
    [
      [100.0, 0.0],
      [101.0, 0.0],
      [101.0, 1.0],
      [100.0, 1.0],
      [100.0, 0.0]
    ]
  ];
  transformCoordinates(input, {}, transform);
  t.deepEquals(input, [
    [
      ['x', 'y'],
      ['x', 'y'],
      ['x', 'y'],
      ['x', 'y'],
      ['x', 'y']
    ]
  ]);
});

test('transform coordinates, multi-point', t => {
  t.plan(1);
  const transform = (coordinates) => {
    coordinates[0] = 'x';
    coordinates[1] = 'y';
  };
  const input = [
    [100.0, 0.0],
    [101.0, 1.0]
  ];
  transformCoordinates(input, {}, transform);
  t.deepEquals(input, [['x', 'y'], ['x', 'y']]
  );
});

test('transform coordinates, multi-linestring', t => {
  t.plan(1);
  const transform = (coordinates) => {
    coordinates[0] = 'x';
    coordinates[1] = 'y';
  };
  const input = [
    [
      [100.0, 0.0],
      [101.0, 1.0]
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0]
    ]
  ];
  transformCoordinates(input, {}, transform);
  t.deepEquals(input, [
    [
      ['x', 'y'],
      ['x', 'y']
    ],
    [
      ['x', 'y'],
      ['x', 'y']
    ]
  ]);
});

test('transform coordinates, multi-polygon', t => {
  t.plan(1);
  const transform = (coordinates) => {
    coordinates[0] = 'x';
    coordinates[1] = 'y';
  };
  const input = [
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0]
      ]
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0]
      ],
      [
        [100.2, 0.2],
        [100.2, 0.8],
        [100.8, 0.8],
        [100.8, 0.2],
        [100.2, 0.2]
      ]
    ]
  ];
  transformCoordinates(input, {}, transform);
  t.deepEquals(input, [
    [
      [
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y']
      ]
    ],
    [
      [
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y']
      ],
      [
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y'],
        ['x', 'y']
      ]
    ]
  ]);
});
