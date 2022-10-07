const {
  getEsriTypeFromDefinition,
  getEsriTypeFromValue
} = require('./esri-type-utils');
const {
  ESRI_FIELD_TYPE_OID,
  ESRI_FIELD_TYPE_STRING,
  ESRI_FIELD_TYPE_DATE,
  ESRI_FIELD_TYPE_DOUBLE,
  SQL_TYPE_INTEGER,
  SQL_TYPE_OTHER,
  SQL_TYPE_FLOAT,
  OBJECTID_DEFAULT_KEY
} = require('./constants');

class Field {
  setEditable (value = false) {
    this.editable = value;
    return this;
  }

  setNullable (value = false) {
    this.nullable = value;
    return this;
  }

  setLength () {
    if (this.type === ESRI_FIELD_TYPE_STRING) {
      this.length = 128;
    } else if (this.type === ESRI_FIELD_TYPE_DATE) {
      this.length = 36;
    }
  }
}

class ObjectIdField extends Field {
  constructor (key = OBJECTID_DEFAULT_KEY) {
    super();
    this.name = key;
    this.type = ESRI_FIELD_TYPE_OID;
    this.alias = key;
    this.sqlType = SQL_TYPE_INTEGER;
    this.domain = null;
    this.defaultValue = null;
  }
}

class FieldFromKeyValue extends Field {
  constructor (key, value) {
    super();
    this.name = key;
    this.type = getEsriTypeFromValue(value);
    this.alias = key;
    this.sqlType = SQL_TYPE_OTHER;
    this.domain = null;
    this.defaultValue = null;
    this.setLength();
  }
}

class StatisticField extends Field {
  constructor (key) {
    super();
    this.name = key;
    this.type = ESRI_FIELD_TYPE_DOUBLE;
    this.sqlType = SQL_TYPE_FLOAT;
    this.alias = key;
    this.domain = null;
    this.defaultValue = null;
  }
}

class StatisticDateField extends StatisticField {
  constructor (key) {
    super(key);
    this.type = ESRI_FIELD_TYPE_DATE;
    this.sqlType = SQL_TYPE_OTHER;
  }
}

class FieldFromFieldDefinition extends Field {
  constructor (fieldDefinition) {
    super();
    const {
      name,
      type,
      alias,
      domain,
      sqlType,
      length,
      defaultValue
    } = fieldDefinition;

    this.name = name;
    this.type = getEsriTypeFromDefinition(type);
    this.alias = alias || name;
    this.sqlType = sqlType || SQL_TYPE_OTHER;
    this.domain = domain || null;
    this.defaultValue = defaultValue || null;
    this.length = length;

    if (!this.length || !Number.isInteger(this.length)) {
      this.setLength();
    }
  }
}

class ObjectIdFieldFromDefinition extends FieldFromFieldDefinition {
  constructor (definition = {}) {
    super(definition);
    this.type = ESRI_FIELD_TYPE_OID;
    this.sqlType = SQL_TYPE_INTEGER;
    delete this.length;
  }
}

module.exports = {
  ObjectIdField,
  ObjectIdFieldFromDefinition,
  FieldFromKeyValue,
  FieldFromFieldDefinition,
  StatisticField,
  StatisticDateField
};
