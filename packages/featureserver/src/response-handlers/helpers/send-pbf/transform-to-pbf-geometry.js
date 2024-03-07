function transformToPbfGeometry(geometry, transform) {
  if (!geometry) {
    return null;
  }

  if (isPoint(geometry)) {
    return transformPoint(geometry, transform);
  }

  if (isPolyline(geometry)) {
    return transformPolyline(geometry, transform, false, false);
  }

  if (isPolygon(geometry)) {
    return transformPolygon(geometry, transform, false, false);
  }

  if (isMultipoint(geometry)) {
    return transformMultipoint(geometry, transform, false, false);
  }

  throw new Error(`Unknown geometry type: ${JSON.stringify(geometry)}`);
}

function isMultipoint(json) {
  return json.points !== undefined;
}

function isPoint(json) {
  return json.x !== undefined && json.y !== undefined;
}

function isPolyline(json) {
  return json.paths !== undefined;
}

function isPolygon(json) {
  return json.rings !== undefined;
}

function transformMultipoint(geometry, transform) {
  const points = transformPoints(geometry.points, transform);
  return {
    lengths: [points.length],
    coords: points.flat(),
  };
}

function transformPoint(geometry, transform) {
  const {
    scale: { xScale, yScale },
    translate: { xTranslate, yTranslate },
  } = transform;

  const x = quantizeX(geometry.x, xScale, xTranslate);
  const y = quantizeY(geometry.y, yScale, yTranslate);

  const coords = createCoordinatesArray(x, y, geometry.z, geometry.m);
  return {
    lengths: [coords.length],
    coords,
  };
}

function transformPolygon(geometry, transform, hasZ, hasM) {
  const rings = transformRings(geometry.rings, transform, hasZ, hasM);

  return {
    lengths: rings.map((ring) => ring.length),
    coords: rings.flat().flat(),
  };
}

function transformPolyline(geometry, transform) {
  const paths = transformPaths(geometry.paths, transform);

  return {
    lengths: paths.map((path) => path.length),
    coords: paths.flat().flat(),
  };
}

function createCoordinatesArray(x, y, placeholder1, placeholder2) {
  const result = [x, y];

  if (placeholder1) {
    result.push(placeholder1);
  }

  if (placeholder2) {
    result.push(placeholder2);
  }
  return result;
}

function quantizeX(x, scale, translate) {
  return Math.round((x - translate) / scale);
}

function quantizeY(y, scale, translate) {
  return Math.round((translate - y) / scale);
}

function transformCoordsArray(coordsArray, transform) {
  const {
    scale: { xScale, yScale },
    translate: { xTranslate, yTranslate },
  } = transform;
  const result = [];
  let prevX;
  let prevY;
  let x;
  let y;

  for (let i = 0; i < coordsArray.length; i++) {
    const coords = coordsArray[i];

    if (i > 0) {
      x = quantizeX(coords[0], xScale, xTranslate);
      y = quantizeY(coords[1], yScale, yTranslate);

      if (x !== prevX || y !== prevY) {
        result.push(
          createCoordinatesArray(x - prevX, y - prevY, coords[2], coords[3]),
        );
        prevX = x;
        prevY = y;
      }
    } else {
      prevX = quantizeX(coords[0], xScale, xTranslate);
      prevY = quantizeY(coords[1], yScale, yTranslate);
      result.push(createCoordinatesArray(prevX, prevY, coords[2], coords[3]));
    }
  }
  return result;
}

function transformPoints(points, transform) {
  return transformCoordsArray(points, transform);
}

function transformRings(rings, transform) {
  const result = [];

  for (let i = 0; i < rings.length; i++) {
    const ring = transformCoordsArray(rings[i], transform);

    result.push(ring);
  }

  return result;
}

function transformPaths(paths, transform) {
  const result = [];

  for (let i = 0; i < paths.length; i++) {
    const path = transformCoordsArray(paths[i], transform);

    result.push(path);
  }

  return result;
}

module.exports = {
  transformToPbfGeometry,
};
