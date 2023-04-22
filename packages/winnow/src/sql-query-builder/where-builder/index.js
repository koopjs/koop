const { InvalidWhereParameterError } = require('../../errors');
const convertSqlWhereToJsonWhere = require('./to-json-where');

const timestampCastRegex = /(TIMESTAMP|DATE) '([^']*)'/gi; // eslint-disable-line
const timestampWithoutZoneRegex =
  /^\d{4}-\d{2}-\d{2} {0,1}\d{0,2}:{0,1}\d{0,2}:{0,1}\d{0,2}$/;

// RegExp for name-first predicate, e.g "properties->`OBJECTID` = 1234"
const fieldFirstObjectIdPredicateRegex =
  /(properties|attributes)->`OBJECTID` (=|<|>|<=|>=) ([0-9]+)/g;

// RegExp for value-first predicate, e.g "1234 = properties->`OBJECTID`""
const valueFirstObjectIdPredicateRegex =
  /([0-9]+) (=|<|>|<=|>=) (properties|attributes)->`OBJECTID`/g;

const operatorInversions = {
  '=': '=',
  '>=': '<',
  '>': '<=',
  '<=': '>',
  '<': '>=',
};

const SINGLE_QUOTE_ESCAPE = '\\';

class WhereBuilder {
  static create (params) {
    const builder = new WhereBuilder(params);
    return builder
      .castTimestamps()
      .replaceSingleQuoteEscapeChars()
      .toJsonSQL()
      .replaceObjectIdPredicates()
      .addGeometryPredicate()
      .value();
  }

  #geometryFilter;
  #options;
  #where;
  #geometryPredicate;

  constructor ({ where, geometry, ...options } = {}) {
    this.#where = where;
    this.#geometryFilter = geometry;
    this.#geometryPredicate;
    this.#options = options;
  }

  addGeometryPredicate () {
    if (!this.#geometryFilter) {
      return this;
    }

    const spatialPredicate = this.#options.spatialPredicate || 'ST_Intersects';
    
    // The "?" in the string below is a SQL query parameter.  When it is executed,
    // a supplied value is used in its place
    this.#geometryPredicate = `${spatialPredicate}(geometry, ?)`;

    return this;
  }

  #shouldReplaceObjectIdPredicates() {
    return this.#where?.includes('OBJECTID') && !this.#options?.idField;
  }

  castTimestamps () {
    if (!this.#where) {
      return this;
    }

    this.#where = this.#where.replace(timestampCastRegex, function(match, cast, timestamp){
      return `'${normalizeTimestamp(timestamp)}'`;
    });

    return this;
  }

  replaceSingleQuoteEscapeChars() {
    if (!this.#where) {
      return this;
    }

    let insideSingleQuote = false;
    
    const charArr = this.#where.split('');
  
    charArr.forEach((currentChar, i) => {
      const nextChar = charArr[i + 1];
      const prevChar = charArr[i - 1];
      const lastTwoChars = `${charArr[i - 1]}${charArr[i - 0]}`;
  
      if (isBeginningOfSingleQuoteWrap(currentChar, insideSingleQuote)) {
        insideSingleQuote = true;
      } else if (isSingleQuoteEscapeChar(currentChar, nextChar, prevChar, insideSingleQuote)) {
        charArr[i] = SINGLE_QUOTE_ESCAPE;
      } else if (isEndOfSingleQuoteWrap(currentChar, lastTwoChars, insideSingleQuote)) {
        insideSingleQuote = false;
      }
    });
  
    this.#where = charArr.join('');
    return this;
  }
  
  toJsonSQL () {
    if (!this.#where) {
      return this;
    }

    this.#where = convertSqlWhereToJsonWhere(this.#where, this.#options);
    return this;
  }

  /**
   * if the where clause includes OBJECTID predicate and there is no "idField" option
   * assume ArcGIS clients querying a Koop dataset where OBJECTID is created on the fly
   * from the hashed feature. As a result, the OBJECTID predicate must be replaced by 
   * an inline function that (1) hashes the feature and (2) executes the comparison
   */
  replaceObjectIdPredicates() {
    if (!this.#where || !this.#shouldReplaceObjectIdPredicates()) {
      return this;
    }


    this.#where = this.#where
      .replace(
        fieldFirstObjectIdPredicateRegex,
        'hashedObjectIdComparator($1, geometry, $3, \'$2\')=true',
      )
      .replace(
        valueFirstObjectIdPredicateRegex,
        (match, value, operator, parentProperty) => {
          return `hashedObjectIdComparator(${parentProperty}, geometry, ${value}, '${operatorInversions[operator]}')=true`;
        },
      );

    return this;
  }

  value () {
    if (!this.#where && !this.#geometryPredicate) {
      return;
    }

    const fragments = [];

    if (this.#where) {
      fragments.push(this.#where);
    }

    if (this.#geometryPredicate) {
      fragments.push(this.#geometryPredicate);
    }

    return `${fragments.join(' AND ')}`;
  }
}


function normalizeTimestamp(timestamp) {
  const normalizedTimestamp = timestampWithoutZoneRegex.test(timestamp)
    ? `${timestamp}Z`
    : timestamp;
  try {
    return new Date(normalizedTimestamp).toISOString();
  } catch (error) {
    throw new InvalidWhereParameterError(`${error.message} for timestamp "${timestamp}"`);
  }
}

function isBeginningOfSingleQuoteWrap(char, insideSingleQuotes) {
  return insideSingleQuotes === false && char === '\'';
}

function isSingleQuoteEscapeChar(char, next, prev, insideSingleQuotes) {
  return (
    insideSingleQuotes === true && char === '\'' && next === '\'' && prev !== SINGLE_QUOTE_ESCAPE
  );
}

function isEndOfSingleQuoteWrap(char, lastTwoChars, insideSingleQuotes) {
  return insideSingleQuotes === true && char === '\'' && lastTwoChars !== `${SINGLE_QUOTE_ESCAPE}'`;
}
module.exports = WhereBuilder;
