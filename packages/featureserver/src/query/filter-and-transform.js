const { query } = require('@koopjs/winnow');
const helpers = require('../helpers');

function filterAndTransform(json, requestParams) {
  const { features, type, ...restJson } = json;
  const params = FilterAndTransformParams.create(requestParams)
    .removeParamsAlreadyApplied(json.filtersApplied)
    .addToEsri()
    .addInputCrs(json);

  const result = query(json, params);

  const { outStatistics } = params;

  if (outStatistics) {
    return {
      statistics: result,
      ...restJson,
    };
  }

  return result;
}

class FilterAndTransformParams {
  static create(requestParams) {
    return new FilterAndTransformParams(requestParams);
  }

  static standardize(requestParams) {
    const { returnDistinctValues, where = '1=1', ...rest } = requestParams;

    return {
      ...rest,
      distinct: !!returnDistinctValues,
      where: extractPlusPlaceHolders(where),
    };
  }

  constructor(requestParams) {
    const params = FilterAndTransformParams.standardize(requestParams);
    Object.assign(this, params);
  }

  removeParamsAlreadyApplied(alreadyApplied) {
    for (const key in alreadyApplied) {
      if (key === 'projection') {
        delete this.outSR;
      }

      if (key === 'offset') {
        delete this.resultOffset;
      }

      delete this[key];
    }

    return this;
  }

  addToEsri() {
    this.toEsri = this.f !== 'geojson' && !this.returnExtentOnly;
    return this;
  }

  addInputCrs(data) {
    const { metadata = {} } = data;
    this.inputCrs =
      this.inputCrs || this.sourceSR || metadata.crs || helpers.getCollectionCrs(data) || 4326;
    delete this.sourceSR;
    return this;
  }
}

function extractPlusPlaceHolders(where) {
  let openDouble = false;
  let openSingle = false;
  const whereWithReplacedSingleQuotes = where.replace(/''/g, '~~xxx~~');

  const charArray = Array.from(whereWithReplacedSingleQuotes);
  return charArray
    .map((char) => {
      if (char === "'" && !openDouble) {
        openSingle = !openSingle;
      }

      if (char === '"' && !openSingle) {
        openDouble = !openDouble;
      }

      if (char === '+' && !openDouble && !openSingle) {
        return ' ';
      }
      return char;
    })
    .join('')
    .replace(/~~xxx~~/g, "''");
}
module.exports = { filterAndTransform };
