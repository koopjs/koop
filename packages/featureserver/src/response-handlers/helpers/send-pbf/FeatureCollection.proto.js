// TODO: move this to a npm
/* eslint-disable */
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

var $Writer = $protobuf.Writer, $util = $protobuf.util;

var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.esriPBuffer = (function() {

    var esriPBuffer = {};

    esriPBuffer.FeatureCollectionPBuffer = (function() {

        function FeatureCollectionPBuffer(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        FeatureCollectionPBuffer.prototype.version = "";
        FeatureCollectionPBuffer.prototype.queryResult = null;

        FeatureCollectionPBuffer.create = function create(properties) {
            return new FeatureCollectionPBuffer(properties);
        };

        FeatureCollectionPBuffer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(10).string(message.version);
            if (message.queryResult != null && Object.hasOwnProperty.call(message, "queryResult"))
                $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.encode(message.queryResult, writer.uint32(18).fork()).ldelim();
            return writer;
        };

        FeatureCollectionPBuffer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        FeatureCollectionPBuffer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.queryResult != null && message.hasOwnProperty("queryResult")) {
                var error = $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.verify(message.queryResult);
                if (error)
                    return "queryResult." + error;
            }
            return null;
        };

        FeatureCollectionPBuffer.fromObject = function fromObject(object) {
            if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer)
                return object;
            var message = new $root.esriPBuffer.FeatureCollectionPBuffer();
            if (object.version != null)
                message.version = String(object.version);
            if (object.queryResult != null) {
                if (typeof object.queryResult !== "object")
                    throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.queryResult: object expected");
                message.queryResult = $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.fromObject(object.queryResult);
            }
            return message;
        };

        FeatureCollectionPBuffer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.version = "";
                object.queryResult = null;
            }
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.queryResult != null && message.hasOwnProperty("queryResult"))
                object.queryResult = $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.toObject(message.queryResult, options);
            return object;
        };

        FeatureCollectionPBuffer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        FeatureCollectionPBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer";
        };

        FeatureCollectionPBuffer.GeometryType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "esriGeometryTypePoint"] = 0;
            values[valuesById[1] = "esriGeometryTypeMultipoint"] = 1;
            values[valuesById[2] = "esriGeometryTypePolyline"] = 2;
            values[valuesById[3] = "esriGeometryTypePolygon"] = 3;
            values[valuesById[4] = "esriGeometryTypeMultipatch"] = 4;
            values[valuesById[127] = "esriGeometryTypeNone"] = 127;
            values[valuesById[5] = "esriGeometryTypeEnvelope"] = 5;
            return values;
        })();

        FeatureCollectionPBuffer.FieldType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "esriFieldTypeSmallInteger"] = 0;
            values[valuesById[1] = "esriFieldTypeInteger"] = 1;
            values[valuesById[2] = "esriFieldTypeSingle"] = 2;
            values[valuesById[3] = "esriFieldTypeDouble"] = 3;
            values[valuesById[4] = "esriFieldTypeString"] = 4;
            values[valuesById[5] = "esriFieldTypeDate"] = 5;
            values[valuesById[6] = "esriFieldTypeOID"] = 6;
            values[valuesById[7] = "esriFieldTypeGeometry"] = 7;
            values[valuesById[8] = "esriFieldTypeBlob"] = 8;
            values[valuesById[9] = "esriFieldTypeRaster"] = 9;
            values[valuesById[10] = "esriFieldTypeGUID"] = 10;
            values[valuesById[11] = "esriFieldTypeGlobalID"] = 11;
            values[valuesById[12] = "esriFieldTypeXML"] = 12;
            values[valuesById[13] = "esriFieldTypeBigInteger"] = 13;
            values[valuesById[14] = "esriFieldTypeDateOnly"] = 14;
            values[valuesById[15] = "esriFieldTypeTimeOnly"] = 15;
            values[valuesById[16] = "esriFieldTypeTimestampOffset"] = 16;
            return values;
        })();

        FeatureCollectionPBuffer.SQLType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "sqlTypeBigInt"] = 0;
            values[valuesById[1] = "sqlTypeBinary"] = 1;
            values[valuesById[2] = "sqlTypeBit"] = 2;
            values[valuesById[3] = "sqlTypeChar"] = 3;
            values[valuesById[4] = "sqlTypeDate"] = 4;
            values[valuesById[5] = "sqlTypeDecimal"] = 5;
            values[valuesById[6] = "sqlTypeDouble"] = 6;
            values[valuesById[7] = "sqlTypeFloat"] = 7;
            values[valuesById[8] = "sqlTypeGeometry"] = 8;
            values[valuesById[9] = "sqlTypeGUID"] = 9;
            values[valuesById[10] = "sqlTypeInteger"] = 10;
            values[valuesById[11] = "sqlTypeLongNVarchar"] = 11;
            values[valuesById[12] = "sqlTypeLongVarbinary"] = 12;
            values[valuesById[13] = "sqlTypeLongVarchar"] = 13;
            values[valuesById[14] = "sqlTypeNChar"] = 14;
            values[valuesById[15] = "sqlTypeNVarchar"] = 15;
            values[valuesById[16] = "sqlTypeOther"] = 16;
            values[valuesById[17] = "sqlTypeReal"] = 17;
            values[valuesById[18] = "sqlTypeSmallInt"] = 18;
            values[valuesById[19] = "sqlTypeSqlXml"] = 19;
            values[valuesById[20] = "sqlTypeTime"] = 20;
            values[valuesById[21] = "sqlTypeTimestamp"] = 21;
            values[valuesById[22] = "sqlTypeTimestamp2"] = 22;
            values[valuesById[23] = "sqlTypeTinyInt"] = 23;
            values[valuesById[24] = "sqlTypeVarbinary"] = 24;
            values[valuesById[25] = "sqlTypeVarchar"] = 25;
            values[valuesById[26] = "sqlTypeTimestampWithTimezone"] = 26;
            return values;
        })();

        FeatureCollectionPBuffer.QuantizeOriginPostion = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "upperLeft"] = 0;
            values[valuesById[1] = "lowerLeft"] = 1;
            return values;
        })();

        FeatureCollectionPBuffer.SpatialReference = (function() {

            function SpatialReference(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            SpatialReference.prototype.wkid = 0;
            SpatialReference.prototype.lastestWkid = 0;
            SpatialReference.prototype.vcsWkid = 0;
            SpatialReference.prototype.latestVcsWkid = 0;
            SpatialReference.prototype.wkt = "";

            SpatialReference.create = function create(properties) {
                return new SpatialReference(properties);
            };

            SpatialReference.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.wkid != null && Object.hasOwnProperty.call(message, "wkid"))
                    writer.uint32(8).uint32(message.wkid);
                if (message.lastestWkid != null && Object.hasOwnProperty.call(message, "lastestWkid"))
                    writer.uint32(16).uint32(message.lastestWkid);
                if (message.vcsWkid != null && Object.hasOwnProperty.call(message, "vcsWkid"))
                    writer.uint32(24).uint32(message.vcsWkid);
                if (message.latestVcsWkid != null && Object.hasOwnProperty.call(message, "latestVcsWkid"))
                    writer.uint32(32).uint32(message.latestVcsWkid);
                if (message.wkt != null && Object.hasOwnProperty.call(message, "wkt"))
                    writer.uint32(42).string(message.wkt);
                return writer;
            };

            SpatialReference.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            SpatialReference.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.wkid != null && message.hasOwnProperty("wkid"))
                    if (!$util.isInteger(message.wkid))
                        return "wkid: integer expected";
                if (message.lastestWkid != null && message.hasOwnProperty("lastestWkid"))
                    if (!$util.isInteger(message.lastestWkid))
                        return "lastestWkid: integer expected";
                if (message.vcsWkid != null && message.hasOwnProperty("vcsWkid"))
                    if (!$util.isInteger(message.vcsWkid))
                        return "vcsWkid: integer expected";
                if (message.latestVcsWkid != null && message.hasOwnProperty("latestVcsWkid"))
                    if (!$util.isInteger(message.latestVcsWkid))
                        return "latestVcsWkid: integer expected";
                if (message.wkt != null && message.hasOwnProperty("wkt"))
                    if (!$util.isString(message.wkt))
                        return "wkt: string expected";
                return null;
            };

            SpatialReference.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference();
                if (object.wkid != null)
                    message.wkid = object.wkid >>> 0;
                if (object.lastestWkid != null)
                    message.lastestWkid = object.lastestWkid >>> 0;
                if (object.vcsWkid != null)
                    message.vcsWkid = object.vcsWkid >>> 0;
                if (object.latestVcsWkid != null)
                    message.latestVcsWkid = object.latestVcsWkid >>> 0;
                if (object.wkt != null)
                    message.wkt = String(object.wkt);
                return message;
            };

            SpatialReference.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.wkid = 0;
                    object.lastestWkid = 0;
                    object.vcsWkid = 0;
                    object.latestVcsWkid = 0;
                    object.wkt = "";
                }
                if (message.wkid != null && message.hasOwnProperty("wkid"))
                    object.wkid = message.wkid;
                if (message.lastestWkid != null && message.hasOwnProperty("lastestWkid"))
                    object.lastestWkid = message.lastestWkid;
                if (message.vcsWkid != null && message.hasOwnProperty("vcsWkid"))
                    object.vcsWkid = message.vcsWkid;
                if (message.latestVcsWkid != null && message.hasOwnProperty("latestVcsWkid"))
                    object.latestVcsWkid = message.latestVcsWkid;
                if (message.wkt != null && message.hasOwnProperty("wkt"))
                    object.wkt = message.wkt;
                return object;
            };

            SpatialReference.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            SpatialReference.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.SpatialReference";
            };

            return SpatialReference;
        })();

        FeatureCollectionPBuffer.Field = (function() {

            function Field(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Field.prototype.name = "";
            Field.prototype.fieldType = 0;
            Field.prototype.alias = "";
            Field.prototype.sqlType = 0;
            Field.prototype.domain = "";
            Field.prototype.defaultValue = "";

            Field.create = function create(properties) {
                return new Field(properties);
            };

            Field.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(10).string(message.name);
                if (message.fieldType != null && Object.hasOwnProperty.call(message, "fieldType"))
                    writer.uint32(16).int32(message.fieldType);
                if (message.alias != null && Object.hasOwnProperty.call(message, "alias"))
                    writer.uint32(26).string(message.alias);
                if (message.sqlType != null && Object.hasOwnProperty.call(message, "sqlType"))
                    writer.uint32(32).int32(message.sqlType);
                if (message.domain != null && Object.hasOwnProperty.call(message, "domain"))
                    writer.uint32(42).string(message.domain);
                if (message.defaultValue != null && Object.hasOwnProperty.call(message, "defaultValue"))
                    writer.uint32(50).string(message.defaultValue);
                return writer;
            };

            Field.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Field.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.fieldType != null && message.hasOwnProperty("fieldType"))
                    switch (message.fieldType) {
                    default:
                        return "fieldType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                        break;
                    }
                if (message.alias != null && message.hasOwnProperty("alias"))
                    if (!$util.isString(message.alias))
                        return "alias: string expected";
                if (message.sqlType != null && message.hasOwnProperty("sqlType"))
                    switch (message.sqlType) {
                    default:
                        return "sqlType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 26:
                        break;
                    }
                if (message.domain != null && message.hasOwnProperty("domain"))
                    if (!$util.isString(message.domain))
                        return "domain: string expected";
                if (message.defaultValue != null && message.hasOwnProperty("defaultValue"))
                    if (!$util.isString(message.defaultValue))
                        return "defaultValue: string expected";
                return null;
            };

    Field.fromObject = function fromObject(object) {
        if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Field)
            return object;
        var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Field();
        if (object.name != null)
            message.name = String(object.name);
        switch (object.fieldType) {
        default:
            if (typeof object.fieldType === "number") {
                message.fieldType = object.fieldType;
                break;
            }
            break;
        case "esriFieldTypeSmallInteger":
        case 0:
            message.fieldType = 0;
            break;
        case "esriFieldTypeInteger":
        case 1:
            message.fieldType = 1;
            break;
        case "esriFieldTypeSingle":
        case 2:
            message.fieldType = 2;
            break;
        case "esriFieldTypeDouble":
        case 3:
            message.fieldType = 3;
            break;
        case "esriFieldTypeString":
        case 4:
            message.fieldType = 4;
            break;
        case "esriFieldTypeDate":
        case 5:
            message.fieldType = 5;
            break;
        case "esriFieldTypeOID":
        case 6:
            message.fieldType = 6;
            break;
        case "esriFieldTypeGeometry":
        case 7:
            message.fieldType = 7;
            break;
        case "esriFieldTypeBlob":
        case 8:
            message.fieldType = 8;
            break;
        case "esriFieldTypeRaster":
        case 9:
            message.fieldType = 9;
            break;
        case "esriFieldTypeGUID":
        case 10:
            message.fieldType = 10;
            break;
        case "esriFieldTypeGlobalID":
        case 11:
            message.fieldType = 11;
            break;
        case "esriFieldTypeXML":
        case 12:
            message.fieldType = 12;
            break;
        case "esriFieldTypeBigInteger":
        case 13:
            message.fieldType = 13;
            break;
        case "esriFieldTypeDateOnly":
        case 14:
            message.fieldType = 14;
            break;
        case "esriFieldTypeTimeOnly":
        case 15:
            message.fieldType = 15;
            break;
        case "esriFieldTypeTimestampOffset":
        case 16:
            message.fieldType = 16;
            break;
        }
        if (object.alias != null)
            message.alias = String(object.alias);
        switch (object.sqlType) {
        default:
            if (typeof object.sqlType === "number") {
                message.sqlType = object.sqlType;
                break;
            }
            break;
        case "sqlTypeBigInt":
        case 0:
            message.sqlType = 0;
            break;
        case "sqlTypeBinary":
        case 1:
            message.sqlType = 1;
            break;
        case "sqlTypeBit":
        case 2:
            message.sqlType = 2;
            break;
        case "sqlTypeChar":
        case 3:
            message.sqlType = 3;
            break;
        case "sqlTypeDate":
        case 4:
            message.sqlType = 4;
            break;
        case "sqlTypeDecimal":
        case 5:
            message.sqlType = 5;
            break;
        case "sqlTypeDouble":
        case 6:
            message.sqlType = 6;
            break;
        case "sqlTypeFloat":
        case 7:
            message.sqlType = 7;
            break;
        case "sqlTypeGeometry":
        case 8:
            message.sqlType = 8;
            break;
        case "sqlTypeGUID":
        case 9:
            message.sqlType = 9;
            break;
        case "sqlTypeInteger":
        case 10:
            message.sqlType = 10;
            break;
        case "sqlTypeLongNVarchar":
        case 11:
            message.sqlType = 11;
            break;
        case "sqlTypeLongVarbinary":
        case 12:
            message.sqlType = 12;
            break;
        case "sqlTypeLongVarchar":
        case 13:
            message.sqlType = 13;
            break;
        case "sqlTypeNChar":
        case 14:
            message.sqlType = 14;
            break;
        case "sqlTypeNVarchar":
        case 15:
            message.sqlType = 15;
            break;
        case "sqlTypeOther":
        case 16:
            message.sqlType = 16;
            break;
        case "sqlTypeReal":
        case 17:
            message.sqlType = 17;
            break;
        case "sqlTypeSmallInt":
        case 18:
            message.sqlType = 18;
            break;
        case "sqlTypeSqlXml":
        case 19:
            message.sqlType = 19;
            break;
        case "sqlTypeTime":
        case 20:
            message.sqlType = 20;
            break;
        case "sqlTypeTimestamp":
        case 21:
            message.sqlType = 21;
            break;
        case "sqlTypeTimestamp2":
        case 22:
            message.sqlType = 22;
            break;
        case "sqlTypeTinyInt":
        case 23:
            message.sqlType = 23;
            break;
        case "sqlTypeVarbinary":
        case 24:
            message.sqlType = 24;
            break;
        case "sqlTypeVarchar":
        case 25:
            message.sqlType = 25;
            break;
        case "sqlTypeTimestampWithTimezone":
        case 26:
            message.sqlType = 26;
            break;
        }
        if (object.domain != null)
            message.domain = String(object.domain);
        if (object.defaultValue != null)
            message.defaultValue = String(object.defaultValue);
        return message;
    };

            Field.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.fieldType = options.enums === String ? "esriFieldTypeSmallInteger" : 0;
                    object.alias = "";
                    object.sqlType = options.enums === String ? "sqlTypeBigInt" : 0;
                    object.domain = "";
                    object.defaultValue = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.fieldType != null && message.hasOwnProperty("fieldType"))
                    object.fieldType = options.enums === String ? $root.esriPBuffer.FeatureCollectionPBuffer.FieldType[message.fieldType] === undefined ? message.fieldType : $root.esriPBuffer.FeatureCollectionPBuffer.FieldType[message.fieldType] : message.fieldType;
                if (message.alias != null && message.hasOwnProperty("alias"))
                    object.alias = message.alias;
                if (message.sqlType != null && message.hasOwnProperty("sqlType"))
                    object.sqlType = options.enums === String ? $root.esriPBuffer.FeatureCollectionPBuffer.SQLType[message.sqlType] === undefined ? message.sqlType : $root.esriPBuffer.FeatureCollectionPBuffer.SQLType[message.sqlType] : message.sqlType;
                if (message.domain != null && message.hasOwnProperty("domain"))
                    object.domain = message.domain;
                if (message.defaultValue != null && message.hasOwnProperty("defaultValue"))
                    object.defaultValue = message.defaultValue;
                return object;
            };

            Field.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Field.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Field";
            };

            return Field;
        })();

        FeatureCollectionPBuffer.GeometryField = (function() {

            function GeometryField(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            GeometryField.prototype.field = null;
            GeometryField.prototype.geometryType = 0;

            GeometryField.create = function create(properties) {
                return new GeometryField(properties);
            };

            GeometryField.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.field != null && Object.hasOwnProperty.call(message, "field"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Field.encode(message.field, writer.uint32(10).fork()).ldelim();
                if (message.geometryType != null && Object.hasOwnProperty.call(message, "geometryType"))
                    writer.uint32(16).int32(message.geometryType);
                return writer;
            };

            GeometryField.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            GeometryField.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.field != null && message.hasOwnProperty("field")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.Field.verify(message.field);
                    if (error)
                        return "field." + error;
                }
                if (message.geometryType != null && message.hasOwnProperty("geometryType"))
                    switch (message.geometryType) {
                    default:
                        return "geometryType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 127:
                    case 5:
                        break;
                    }
                return null;
            };

            GeometryField.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField();
                if (object.field != null) {
                    if (typeof object.field !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.GeometryField.field: object expected");
                    message.field = $root.esriPBuffer.FeatureCollectionPBuffer.Field.fromObject(object.field);
                }
                switch (object.geometryType) {
                default:
                    if (typeof object.geometryType === "number") {
                        message.geometryType = object.geometryType;
                        break;
                    }
                    break;
                case "esriGeometryTypePoint":
                case 0:
                    message.geometryType = 0;
                    break;
                case "esriGeometryTypeMultipoint":
                case 1:
                    message.geometryType = 1;
                    break;
                case "esriGeometryTypePolyline":
                case 2:
                    message.geometryType = 2;
                    break;
                case "esriGeometryTypePolygon":
                case 3:
                    message.geometryType = 3;
                    break;
                case "esriGeometryTypeMultipatch":
                case 4:
                    message.geometryType = 4;
                    break;
                case "esriGeometryTypeNone":
                case 127:
                    message.geometryType = 127;
                    break;
                case "esriGeometryTypeEnvelope":
                case 5:
                    message.geometryType = 5;
                    break;
                }
                return message;
            };

            GeometryField.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.field = null;
                    object.geometryType = options.enums === String ? "esriGeometryTypePoint" : 0;
                }
                if (message.field != null && message.hasOwnProperty("field"))
                    object.field = $root.esriPBuffer.FeatureCollectionPBuffer.Field.toObject(message.field, options);
                if (message.geometryType != null && message.hasOwnProperty("geometryType"))
                    object.geometryType = options.enums === String ? $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[message.geometryType] === undefined ? message.geometryType : $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[message.geometryType] : message.geometryType;
                return object;
            };

            GeometryField.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            GeometryField.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.GeometryField";
            };

            return GeometryField;
        })();

        FeatureCollectionPBuffer.Envelope = (function() {

            function Envelope(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Envelope.prototype.XMin = 0;
            Envelope.prototype.YMin = 0;
            Envelope.prototype.XMax = 0;
            Envelope.prototype.YMax = 0;
            Envelope.prototype.SpatialReference = null;

            Envelope.create = function create(properties) {
                return new Envelope(properties);
            };

            Envelope.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.XMin != null && Object.hasOwnProperty.call(message, "XMin"))
                    writer.uint32(9).double(message.XMin);
                if (message.YMin != null && Object.hasOwnProperty.call(message, "YMin"))
                    writer.uint32(17).double(message.YMin);
                if (message.XMax != null && Object.hasOwnProperty.call(message, "XMax"))
                    writer.uint32(25).double(message.XMax);
                if (message.YMax != null && Object.hasOwnProperty.call(message, "YMax"))
                    writer.uint32(33).double(message.YMax);
                if (message.SpatialReference != null && Object.hasOwnProperty.call(message, "SpatialReference"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.encode(message.SpatialReference, writer.uint32(42).fork()).ldelim();
                return writer;
            };

            Envelope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Envelope.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.XMin != null && message.hasOwnProperty("XMin"))
                    if (typeof message.XMin !== "number")
                        return "XMin: number expected";
                if (message.YMin != null && message.hasOwnProperty("YMin"))
                    if (typeof message.YMin !== "number")
                        return "YMin: number expected";
                if (message.XMax != null && message.hasOwnProperty("XMax"))
                    if (typeof message.XMax !== "number")
                        return "XMax: number expected";
                if (message.YMax != null && message.hasOwnProperty("YMax"))
                    if (typeof message.YMax !== "number")
                        return "YMax: number expected";
                if (message.SpatialReference != null && message.hasOwnProperty("SpatialReference")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.verify(message.SpatialReference);
                    if (error)
                        return "SpatialReference." + error;
                }
                return null;
            };

            Envelope.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Envelope)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Envelope();
                if (object.XMin != null)
                    message.XMin = Number(object.XMin);
                if (object.YMin != null)
                    message.YMin = Number(object.YMin);
                if (object.XMax != null)
                    message.XMax = Number(object.XMax);
                if (object.YMax != null)
                    message.YMax = Number(object.YMax);
                if (object.SpatialReference != null) {
                    if (typeof object.SpatialReference !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Envelope.SpatialReference: object expected");
                    message.SpatialReference = $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.fromObject(object.SpatialReference);
                }
                return message;
            };

            Envelope.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.XMin = 0;
                    object.YMin = 0;
                    object.XMax = 0;
                    object.YMax = 0;
                    object.SpatialReference = null;
                }
                if (message.XMin != null && message.hasOwnProperty("XMin"))
                    object.XMin = options.json && !isFinite(message.XMin) ? String(message.XMin) : message.XMin;
                if (message.YMin != null && message.hasOwnProperty("YMin"))
                    object.YMin = options.json && !isFinite(message.YMin) ? String(message.YMin) : message.YMin;
                if (message.XMax != null && message.hasOwnProperty("XMax"))
                    object.XMax = options.json && !isFinite(message.XMax) ? String(message.XMax) : message.XMax;
                if (message.YMax != null && message.hasOwnProperty("YMax"))
                    object.YMax = options.json && !isFinite(message.YMax) ? String(message.YMax) : message.YMax;
                if (message.SpatialReference != null && message.hasOwnProperty("SpatialReference"))
                    object.SpatialReference = $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.toObject(message.SpatialReference, options);
                return object;
            };

            Envelope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Envelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Envelope";
            };

            return Envelope;
        })();

        FeatureCollectionPBuffer.Value = (function() {

            function Value(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Value.prototype.stringValue = null;
            Value.prototype.floatValue = null;
            Value.prototype.doubleValue = null;
            Value.prototype.sintValue = null;
            Value.prototype.uintValue = null;
            Value.prototype.int64Value = null;
            Value.prototype.uint64Value = null;
            Value.prototype.sint64Value = null;
            Value.prototype.boolValue = null;

            var $oneOfFields;

            Object.defineProperty(Value.prototype, "valueType", {
                get: $util.oneOfGetter($oneOfFields = ["stringValue", "floatValue", "doubleValue", "sintValue", "uintValue", "int64Value", "uint64Value", "sint64Value", "boolValue"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            Value.create = function create(properties) {
                return new Value(properties);
            };

            Value.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.stringValue != null && Object.hasOwnProperty.call(message, "stringValue"))
                    writer.uint32(10).string(message.stringValue);
                if (message.floatValue != null && Object.hasOwnProperty.call(message, "floatValue"))
                    writer.uint32(21).float(message.floatValue);
                if (message.doubleValue != null && Object.hasOwnProperty.call(message, "doubleValue"))
                    writer.uint32(25).double(message.doubleValue);
                if (message.sintValue != null && Object.hasOwnProperty.call(message, "sintValue"))
                    writer.uint32(32).sint32(message.sintValue);
                if (message.uintValue != null && Object.hasOwnProperty.call(message, "uintValue"))
                    writer.uint32(40).uint32(message.uintValue);
                if (message.int64Value != null && Object.hasOwnProperty.call(message, "int64Value"))
                    writer.uint32(48).int64(message.int64Value);
                if (message.uint64Value != null && Object.hasOwnProperty.call(message, "uint64Value"))
                    writer.uint32(56).uint64(message.uint64Value);
                if (message.sint64Value != null && Object.hasOwnProperty.call(message, "sint64Value"))
                    writer.uint32(64).sint64(message.sint64Value);
                if (message.boolValue != null && Object.hasOwnProperty.call(message, "boolValue"))
                    writer.uint32(72).bool(message.boolValue);
                return writer;
            };

            Value.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Value.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    properties.valueType = 1;
                    if (!$util.isString(message.stringValue))
                        return "stringValue: string expected";
                }
                if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (typeof message.floatValue !== "number")
                        return "floatValue: number expected";
                }
                if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (typeof message.doubleValue !== "number")
                        return "doubleValue: number expected";
                }
                if (message.sintValue != null && message.hasOwnProperty("sintValue")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (!$util.isInteger(message.sintValue))
                        return "sintValue: integer expected";
                }
                if (message.uintValue != null && message.hasOwnProperty("uintValue")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (!$util.isInteger(message.uintValue))
                        return "uintValue: integer expected";
                }
                if (message.int64Value != null && message.hasOwnProperty("int64Value")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (!$util.isInteger(message.int64Value) && !(message.int64Value && $util.isInteger(message.int64Value.low) && $util.isInteger(message.int64Value.high)))
                        return "int64Value: integer|Long expected";
                }
                if (message.uint64Value != null && message.hasOwnProperty("uint64Value")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (!$util.isInteger(message.uint64Value) && !(message.uint64Value && $util.isInteger(message.uint64Value.low) && $util.isInteger(message.uint64Value.high)))
                        return "uint64Value: integer|Long expected";
                }
                if (message.sint64Value != null && message.hasOwnProperty("sint64Value")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (!$util.isInteger(message.sint64Value) && !(message.sint64Value && $util.isInteger(message.sint64Value.low) && $util.isInteger(message.sint64Value.high)))
                        return "sint64Value: integer|Long expected";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    if (properties.valueType === 1)
                        return "valueType: multiple values";
                    properties.valueType = 1;
                    if (typeof message.boolValue !== "boolean")
                        return "boolValue: boolean expected";
                }
                return null;
            };

            Value.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Value)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Value();
                if (object.stringValue != null)
                    message.stringValue = String(object.stringValue);
                if (object.floatValue != null)
                    message.floatValue = Number(object.floatValue);
                if (object.doubleValue != null)
                    message.doubleValue = Number(object.doubleValue);
                if (object.sintValue != null)
                    message.sintValue = object.sintValue | 0;
                if (object.uintValue != null)
                    message.uintValue = object.uintValue >>> 0;
                if (object.int64Value != null)
                    if ($util.Long)
                        (message.int64Value = $util.Long.fromValue(object.int64Value)).unsigned = false;
                    else if (typeof object.int64Value === "string")
                        message.int64Value = parseInt(object.int64Value, 10);
                    else if (typeof object.int64Value === "number")
                        message.int64Value = object.int64Value;
                    else if (typeof object.int64Value === "object")
                        message.int64Value = new $util.LongBits(object.int64Value.low >>> 0, object.int64Value.high >>> 0).toNumber();
                if (object.uint64Value != null)
                    if ($util.Long)
                        (message.uint64Value = $util.Long.fromValue(object.uint64Value)).unsigned = true;
                    else if (typeof object.uint64Value === "string")
                        message.uint64Value = parseInt(object.uint64Value, 10);
                    else if (typeof object.uint64Value === "number")
                        message.uint64Value = object.uint64Value;
                    else if (typeof object.uint64Value === "object")
                        message.uint64Value = new $util.LongBits(object.uint64Value.low >>> 0, object.uint64Value.high >>> 0).toNumber(true);
                if (object.sint64Value != null)
                    if ($util.Long)
                        (message.sint64Value = $util.Long.fromValue(object.sint64Value)).unsigned = false;
                    else if (typeof object.sint64Value === "string")
                        message.sint64Value = parseInt(object.sint64Value, 10);
                    else if (typeof object.sint64Value === "number")
                        message.sint64Value = object.sint64Value;
                    else if (typeof object.sint64Value === "object")
                        message.sint64Value = new $util.LongBits(object.sint64Value.low >>> 0, object.sint64Value.high >>> 0).toNumber();
                if (object.boolValue != null)
                    message.boolValue = Boolean(object.boolValue);
                return message;
            };

            Value.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.stringValue != null && message.hasOwnProperty("stringValue")) {
                    object.stringValue = message.stringValue;
                    if (options.oneofs)
                        object.valueType = "stringValue";
                }
                if (message.floatValue != null && message.hasOwnProperty("floatValue")) {
                    object.floatValue = options.json && !isFinite(message.floatValue) ? String(message.floatValue) : message.floatValue;
                    if (options.oneofs)
                        object.valueType = "floatValue";
                }
                if (message.doubleValue != null && message.hasOwnProperty("doubleValue")) {
                    object.doubleValue = options.json && !isFinite(message.doubleValue) ? String(message.doubleValue) : message.doubleValue;
                    if (options.oneofs)
                        object.valueType = "doubleValue";
                }
                if (message.sintValue != null && message.hasOwnProperty("sintValue")) {
                    object.sintValue = message.sintValue;
                    if (options.oneofs)
                        object.valueType = "sintValue";
                }
                if (message.uintValue != null && message.hasOwnProperty("uintValue")) {
                    object.uintValue = message.uintValue;
                    if (options.oneofs)
                        object.valueType = "uintValue";
                }
                if (message.int64Value != null && message.hasOwnProperty("int64Value")) {
                    if (typeof message.int64Value === "number")
                        object.int64Value = options.longs === String ? String(message.int64Value) : message.int64Value;
                    else
                        object.int64Value = options.longs === String ? $util.Long.prototype.toString.call(message.int64Value) : options.longs === Number ? new $util.LongBits(message.int64Value.low >>> 0, message.int64Value.high >>> 0).toNumber() : message.int64Value;
                    if (options.oneofs)
                        object.valueType = "int64Value";
                }
                if (message.uint64Value != null && message.hasOwnProperty("uint64Value")) {
                    if (typeof message.uint64Value === "number")
                        object.uint64Value = options.longs === String ? String(message.uint64Value) : message.uint64Value;
                    else
                        object.uint64Value = options.longs === String ? $util.Long.prototype.toString.call(message.uint64Value) : options.longs === Number ? new $util.LongBits(message.uint64Value.low >>> 0, message.uint64Value.high >>> 0).toNumber(true) : message.uint64Value;
                    if (options.oneofs)
                        object.valueType = "uint64Value";
                }
                if (message.sint64Value != null && message.hasOwnProperty("sint64Value")) {
                    if (typeof message.sint64Value === "number")
                        object.sint64Value = options.longs === String ? String(message.sint64Value) : message.sint64Value;
                    else
                        object.sint64Value = options.longs === String ? $util.Long.prototype.toString.call(message.sint64Value) : options.longs === Number ? new $util.LongBits(message.sint64Value.low >>> 0, message.sint64Value.high >>> 0).toNumber() : message.sint64Value;
                    if (options.oneofs)
                        object.valueType = "sint64Value";
                }
                if (message.boolValue != null && message.hasOwnProperty("boolValue")) {
                    object.boolValue = message.boolValue;
                    if (options.oneofs)
                        object.valueType = "boolValue";
                }
                return object;
            };

            Value.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Value.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Value";
            };

            return Value;
        })();

        FeatureCollectionPBuffer.Geometry = (function() {

            function Geometry(properties) {
                this.lengths = [];
                this.coords = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Geometry.prototype.geometryType = 0;
            Geometry.prototype.lengths = $util.emptyArray;
            Geometry.prototype.coords = $util.emptyArray;

            Geometry.create = function create(properties) {
                return new Geometry(properties);
            };

            Geometry.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.geometryType != null && Object.hasOwnProperty.call(message, "geometryType"))
                    writer.uint32(8).int32(message.geometryType);
                if (message.lengths != null && message.lengths.length) {
                    writer.uint32(18).fork();
                    for (var i = 0; i < message.lengths.length; ++i)
                        writer.uint32(message.lengths[i]);
                    writer.ldelim();
                }
                if (message.coords != null && message.coords.length) {
                    writer.uint32(26).fork();
                    for (var i = 0; i < message.coords.length; ++i)
                        writer.sint64(message.coords[i]);
                    writer.ldelim();
                }
                return writer;
            };

            Geometry.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Geometry.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.geometryType != null && message.hasOwnProperty("geometryType"))
                    switch (message.geometryType) {
                    default:
                        return "geometryType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 127:
                    case 5:
                        break;
                    }
                if (message.lengths != null && message.hasOwnProperty("lengths")) {
                    if (!Array.isArray(message.lengths))
                        return "lengths: array expected";
                    for (var i = 0; i < message.lengths.length; ++i)
                        if (!$util.isInteger(message.lengths[i]))
                            return "lengths: integer[] expected";
                }
                if (message.coords != null && message.hasOwnProperty("coords")) {
                    if (!Array.isArray(message.coords))
                        return "coords: array expected";
                    for (var i = 0; i < message.coords.length; ++i)
                        if (!$util.isInteger(message.coords[i]) && !(message.coords[i] && $util.isInteger(message.coords[i].low) && $util.isInteger(message.coords[i].high)))
                            return "coords: integer|Long[] expected";
                }
                return null;
            };

            Geometry.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Geometry)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Geometry();
                switch (object.geometryType) {
                default:
                    if (typeof object.geometryType === "number") {
                        message.geometryType = object.geometryType;
                        break;
                    }
                    break;
                case "esriGeometryTypePoint":
                case 0:
                    message.geometryType = 0;
                    break;
                case "esriGeometryTypeMultipoint":
                case 1:
                    message.geometryType = 1;
                    break;
                case "esriGeometryTypePolyline":
                case 2:
                    message.geometryType = 2;
                    break;
                case "esriGeometryTypePolygon":
                case 3:
                    message.geometryType = 3;
                    break;
                case "esriGeometryTypeMultipatch":
                case 4:
                    message.geometryType = 4;
                    break;
                case "esriGeometryTypeNone":
                case 127:
                    message.geometryType = 127;
                    break;
                case "esriGeometryTypeEnvelope":
                case 5:
                    message.geometryType = 5;
                    break;
                }
                if (object.lengths) {
                    if (!Array.isArray(object.lengths))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Geometry.lengths: array expected");
                    message.lengths = [];
                    for (var i = 0; i < object.lengths.length; ++i)
                        message.lengths[i] = object.lengths[i] >>> 0;
                }
                if (object.coords) {
                    if (!Array.isArray(object.coords))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Geometry.coords: array expected");
                    message.coords = [];
                    for (var i = 0; i < object.coords.length; ++i)
                        if ($util.Long)
                            (message.coords[i] = $util.Long.fromValue(object.coords[i])).unsigned = false;
                        else if (typeof object.coords[i] === "string")
                            message.coords[i] = parseInt(object.coords[i], 10);
                        else if (typeof object.coords[i] === "number")
                            message.coords[i] = object.coords[i];
                        else if (typeof object.coords[i] === "object")
                            message.coords[i] = new $util.LongBits(object.coords[i].low >>> 0, object.coords[i].high >>> 0).toNumber();
                }
                return message;
            };

            Geometry.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.lengths = [];
                    object.coords = [];
                }
                if (options.defaults)
                    object.geometryType = options.enums === String ? "esriGeometryTypePoint" : 0;
                if (message.geometryType != null && message.hasOwnProperty("geometryType"))
                    object.geometryType = options.enums === String ? $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[message.geometryType] === undefined ? message.geometryType : $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[message.geometryType] : message.geometryType;
                if (message.lengths && message.lengths.length) {
                    object.lengths = [];
                    for (var j = 0; j < message.lengths.length; ++j)
                        object.lengths[j] = message.lengths[j];
                }
                if (message.coords && message.coords.length) {
                    object.coords = [];
                    for (var j = 0; j < message.coords.length; ++j)
                        if (typeof message.coords[j] === "number")
                            object.coords[j] = options.longs === String ? String(message.coords[j]) : message.coords[j];
                        else
                            object.coords[j] = options.longs === String ? $util.Long.prototype.toString.call(message.coords[j]) : options.longs === Number ? new $util.LongBits(message.coords[j].low >>> 0, message.coords[j].high >>> 0).toNumber() : message.coords[j];
                }
                return object;
            };

            Geometry.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Geometry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Geometry";
            };

            return Geometry;
        })();

        FeatureCollectionPBuffer.esriShapeBuffer = (function() {

            function esriShapeBuffer(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            esriShapeBuffer.prototype.bytes = $util.newBuffer([]);

            esriShapeBuffer.create = function create(properties) {
                return new esriShapeBuffer(properties);
            };

            esriShapeBuffer.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.bytes != null && Object.hasOwnProperty.call(message, "bytes"))
                    writer.uint32(10).bytes(message.bytes);
                return writer;
            };

            esriShapeBuffer.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            esriShapeBuffer.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.bytes != null && message.hasOwnProperty("bytes"))
                    if (!(message.bytes && typeof message.bytes.length === "number" || $util.isString(message.bytes)))
                        return "bytes: buffer expected";
                return null;
            };

            esriShapeBuffer.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer();
                if (object.bytes != null)
                    if (typeof object.bytes === "string")
                        $util.base64.decode(object.bytes, message.bytes = $util.newBuffer($util.base64.length(object.bytes)), 0);
                    else if (object.bytes.length >= 0)
                        message.bytes = object.bytes;
                return message;
            };

            esriShapeBuffer.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.bytes = "";
                    else {
                        object.bytes = [];
                        if (options.bytes !== Array)
                            object.bytes = $util.newBuffer(object.bytes);
                    }
                if (message.bytes != null && message.hasOwnProperty("bytes"))
                    object.bytes = options.bytes === String ? $util.base64.encode(message.bytes, 0, message.bytes.length) : options.bytes === Array ? Array.prototype.slice.call(message.bytes) : message.bytes;
                return object;
            };

            esriShapeBuffer.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            esriShapeBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer";
            };

            return esriShapeBuffer;
        })();

        FeatureCollectionPBuffer.Feature = (function() {

            function Feature(properties) {
                this.attributes = [];
                this.aggregateGeometries = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Feature.prototype.attributes = $util.emptyArray;
            Feature.prototype.geometry = null;
            Feature.prototype.shapeBuffer = null;
            Feature.prototype.centroid = null;
            Feature.prototype.aggregateGeometries = $util.emptyArray;
            Feature.prototype.envelope = null;

            var $oneOfFields;

            Object.defineProperty(Feature.prototype, "compressedGeometry", {
                get: $util.oneOfGetter($oneOfFields = ["geometry", "shapeBuffer"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            Feature.create = function create(properties) {
                return new Feature(properties);
            };

            Feature.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.attributes != null && message.attributes.length)
                    for (var i = 0; i < message.attributes.length; ++i)
                        $root.esriPBuffer.FeatureCollectionPBuffer.Value.encode(message.attributes[i], writer.uint32(10).fork()).ldelim();
                if (message.geometry != null && Object.hasOwnProperty.call(message, "geometry"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.encode(message.geometry, writer.uint32(18).fork()).ldelim();
                if (message.shapeBuffer != null && Object.hasOwnProperty.call(message, "shapeBuffer"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.encode(message.shapeBuffer, writer.uint32(26).fork()).ldelim();
                if (message.centroid != null && Object.hasOwnProperty.call(message, "centroid"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.encode(message.centroid, writer.uint32(34).fork()).ldelim();
                if (message.aggregateGeometries != null && message.aggregateGeometries.length)
                    for (var i = 0; i < message.aggregateGeometries.length; ++i)
                        $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.encode(message.aggregateGeometries[i], writer.uint32(42).fork()).ldelim();
                if (message.envelope != null && Object.hasOwnProperty.call(message, "envelope"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.encode(message.envelope, writer.uint32(50).fork()).ldelim();
                return writer;
            };

            Feature.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Feature.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.attributes != null && message.hasOwnProperty("attributes")) {
                    if (!Array.isArray(message.attributes))
                        return "attributes: array expected";
                    for (var i = 0; i < message.attributes.length; ++i) {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.Value.verify(message.attributes[i]);
                        if (error)
                            return "attributes." + error;
                    }
                }
                if (message.geometry != null && message.hasOwnProperty("geometry")) {
                    properties.compressedGeometry = 1;
                    {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.verify(message.geometry);
                        if (error)
                            return "geometry." + error;
                    }
                }
                if (message.shapeBuffer != null && message.hasOwnProperty("shapeBuffer")) {
                    if (properties.compressedGeometry === 1)
                        return "compressedGeometry: multiple values";
                    properties.compressedGeometry = 1;
                    {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.verify(message.shapeBuffer);
                        if (error)
                            return "shapeBuffer." + error;
                    }
                }
                if (message.centroid != null && message.hasOwnProperty("centroid")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.verify(message.centroid);
                    if (error)
                        return "centroid." + error;
                }
                if (message.aggregateGeometries != null && message.hasOwnProperty("aggregateGeometries")) {
                    if (!Array.isArray(message.aggregateGeometries))
                        return "aggregateGeometries: array expected";
                    for (var i = 0; i < message.aggregateGeometries.length; ++i) {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.verify(message.aggregateGeometries[i]);
                        if (error)
                            return "aggregateGeometries." + error;
                    }
                }
                if (message.envelope != null && message.hasOwnProperty("envelope")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.verify(message.envelope);
                    if (error)
                        return "envelope." + error;
                }
                return null;
            };

            Feature.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Feature)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Feature();
                if (object.attributes) {
                    if (!Array.isArray(object.attributes))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.attributes: array expected");
                    message.attributes = [];
                    for (var i = 0; i < object.attributes.length; ++i) {
                        if (typeof object.attributes[i] !== "object")
                            throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.attributes: object expected");
                        message.attributes[i] = $root.esriPBuffer.FeatureCollectionPBuffer.Value.fromObject(object.attributes[i]);
                    }
                }
                if (object.geometry != null) {
                    if (typeof object.geometry !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.geometry: object expected");
                    message.geometry = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.fromObject(object.geometry);
                }
                if (object.shapeBuffer != null) {
                    if (typeof object.shapeBuffer !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.shapeBuffer: object expected");
                    message.shapeBuffer = $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.fromObject(object.shapeBuffer);
                }
                if (object.centroid != null) {
                    if (typeof object.centroid !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.centroid: object expected");
                    message.centroid = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.fromObject(object.centroid);
                }
                if (object.aggregateGeometries) {
                    if (!Array.isArray(object.aggregateGeometries))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.aggregateGeometries: array expected");
                    message.aggregateGeometries = [];
                    for (var i = 0; i < object.aggregateGeometries.length; ++i) {
                        if (typeof object.aggregateGeometries[i] !== "object")
                            throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.aggregateGeometries: object expected");
                        message.aggregateGeometries[i] = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.fromObject(object.aggregateGeometries[i]);
                    }
                }
                if (object.envelope != null) {
                    if (typeof object.envelope !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Feature.envelope: object expected");
                    message.envelope = $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.fromObject(object.envelope);
                }
                return message;
            };

            Feature.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.attributes = [];
                    object.aggregateGeometries = [];
                }
                if (options.defaults) {
                    object.centroid = null;
                    object.envelope = null;
                }
                if (message.attributes && message.attributes.length) {
                    object.attributes = [];
                    for (var j = 0; j < message.attributes.length; ++j)
                        object.attributes[j] = $root.esriPBuffer.FeatureCollectionPBuffer.Value.toObject(message.attributes[j], options);
                }
                if (message.geometry != null && message.hasOwnProperty("geometry")) {
                    object.geometry = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.toObject(message.geometry, options);
                    if (options.oneofs)
                        object.compressedGeometry = "geometry";
                }
                if (message.shapeBuffer != null && message.hasOwnProperty("shapeBuffer")) {
                    object.shapeBuffer = $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.toObject(message.shapeBuffer, options);
                    if (options.oneofs)
                        object.compressedGeometry = "shapeBuffer";
                }
                if (message.centroid != null && message.hasOwnProperty("centroid"))
                    object.centroid = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.toObject(message.centroid, options);
                if (message.aggregateGeometries && message.aggregateGeometries.length) {
                    object.aggregateGeometries = [];
                    for (var j = 0; j < message.aggregateGeometries.length; ++j)
                        object.aggregateGeometries[j] = $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.toObject(message.aggregateGeometries[j], options);
                }
                if (message.envelope != null && message.hasOwnProperty("envelope"))
                    object.envelope = $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.toObject(message.envelope, options);
                return object;
            };

            Feature.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Feature.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Feature";
            };

            return Feature;
        })();

        FeatureCollectionPBuffer.UniqueIdField = (function() {

            function UniqueIdField(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            UniqueIdField.prototype.name = "";
            UniqueIdField.prototype.isSystemMaintained = false;

            UniqueIdField.create = function create(properties) {
                return new UniqueIdField(properties);
            };

            UniqueIdField.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(10).string(message.name);
                if (message.isSystemMaintained != null && Object.hasOwnProperty.call(message, "isSystemMaintained"))
                    writer.uint32(16).bool(message.isSystemMaintained);
                return writer;
            };

            UniqueIdField.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            UniqueIdField.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.isSystemMaintained != null && message.hasOwnProperty("isSystemMaintained"))
                    if (typeof message.isSystemMaintained !== "boolean")
                        return "isSystemMaintained: boolean expected";
                return null;
            };

            UniqueIdField.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.isSystemMaintained != null)
                    message.isSystemMaintained = Boolean(object.isSystemMaintained);
                return message;
            };

            UniqueIdField.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.name = "";
                    object.isSystemMaintained = false;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.isSystemMaintained != null && message.hasOwnProperty("isSystemMaintained"))
                    object.isSystemMaintained = message.isSystemMaintained;
                return object;
            };

            UniqueIdField.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            UniqueIdField.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.UniqueIdField";
            };

            return UniqueIdField;
        })();

        FeatureCollectionPBuffer.GeometryProperties = (function() {

            function GeometryProperties(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            GeometryProperties.prototype.shapeAreaFieldName = "";
            GeometryProperties.prototype.shapeLengthFieldName = "";
            GeometryProperties.prototype.units = "";

            GeometryProperties.create = function create(properties) {
                return new GeometryProperties(properties);
            };

            GeometryProperties.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.shapeAreaFieldName != null && Object.hasOwnProperty.call(message, "shapeAreaFieldName"))
                    writer.uint32(10).string(message.shapeAreaFieldName);
                if (message.shapeLengthFieldName != null && Object.hasOwnProperty.call(message, "shapeLengthFieldName"))
                    writer.uint32(18).string(message.shapeLengthFieldName);
                if (message.units != null && Object.hasOwnProperty.call(message, "units"))
                    writer.uint32(26).string(message.units);
                return writer;
            };

            GeometryProperties.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            GeometryProperties.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.shapeAreaFieldName != null && message.hasOwnProperty("shapeAreaFieldName"))
                    if (!$util.isString(message.shapeAreaFieldName))
                        return "shapeAreaFieldName: string expected";
                if (message.shapeLengthFieldName != null && message.hasOwnProperty("shapeLengthFieldName"))
                    if (!$util.isString(message.shapeLengthFieldName))
                        return "shapeLengthFieldName: string expected";
                if (message.units != null && message.hasOwnProperty("units"))
                    if (!$util.isString(message.units))
                        return "units: string expected";
                return null;
            };

            GeometryProperties.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties();
                if (object.shapeAreaFieldName != null)
                    message.shapeAreaFieldName = String(object.shapeAreaFieldName);
                if (object.shapeLengthFieldName != null)
                    message.shapeLengthFieldName = String(object.shapeLengthFieldName);
                if (object.units != null)
                    message.units = String(object.units);
                return message;
            };

            GeometryProperties.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.shapeAreaFieldName = "";
                    object.shapeLengthFieldName = "";
                    object.units = "";
                }
                if (message.shapeAreaFieldName != null && message.hasOwnProperty("shapeAreaFieldName"))
                    object.shapeAreaFieldName = message.shapeAreaFieldName;
                if (message.shapeLengthFieldName != null && message.hasOwnProperty("shapeLengthFieldName"))
                    object.shapeLengthFieldName = message.shapeLengthFieldName;
                if (message.units != null && message.hasOwnProperty("units"))
                    object.units = message.units;
                return object;
            };

            GeometryProperties.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            GeometryProperties.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.GeometryProperties";
            };

            return GeometryProperties;
        })();

        FeatureCollectionPBuffer.ServerGens = (function() {

            function ServerGens(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            ServerGens.prototype.minServerGen = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
            ServerGens.prototype.serverGen = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            ServerGens.create = function create(properties) {
                return new ServerGens(properties);
            };

            ServerGens.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.minServerGen != null && Object.hasOwnProperty.call(message, "minServerGen"))
                    writer.uint32(8).uint64(message.minServerGen);
                if (message.serverGen != null && Object.hasOwnProperty.call(message, "serverGen"))
                    writer.uint32(16).uint64(message.serverGen);
                return writer;
            };

            ServerGens.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            ServerGens.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.minServerGen != null && message.hasOwnProperty("minServerGen"))
                    if (!$util.isInteger(message.minServerGen) && !(message.minServerGen && $util.isInteger(message.minServerGen.low) && $util.isInteger(message.minServerGen.high)))
                        return "minServerGen: integer|Long expected";
                if (message.serverGen != null && message.hasOwnProperty("serverGen"))
                    if (!$util.isInteger(message.serverGen) && !(message.serverGen && $util.isInteger(message.serverGen.low) && $util.isInteger(message.serverGen.high)))
                        return "serverGen: integer|Long expected";
                return null;
            };

            ServerGens.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens();
                if (object.minServerGen != null)
                    if ($util.Long)
                        (message.minServerGen = $util.Long.fromValue(object.minServerGen)).unsigned = true;
                    else if (typeof object.minServerGen === "string")
                        message.minServerGen = parseInt(object.minServerGen, 10);
                    else if (typeof object.minServerGen === "number")
                        message.minServerGen = object.minServerGen;
                    else if (typeof object.minServerGen === "object")
                        message.minServerGen = new $util.LongBits(object.minServerGen.low >>> 0, object.minServerGen.high >>> 0).toNumber(true);
                if (object.serverGen != null)
                    if ($util.Long)
                        (message.serverGen = $util.Long.fromValue(object.serverGen)).unsigned = true;
                    else if (typeof object.serverGen === "string")
                        message.serverGen = parseInt(object.serverGen, 10);
                    else if (typeof object.serverGen === "number")
                        message.serverGen = object.serverGen;
                    else if (typeof object.serverGen === "object")
                        message.serverGen = new $util.LongBits(object.serverGen.low >>> 0, object.serverGen.high >>> 0).toNumber(true);
                return message;
            };

            ServerGens.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.minServerGen = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.minServerGen = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.serverGen = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.serverGen = options.longs === String ? "0" : 0;
                }
                if (message.minServerGen != null && message.hasOwnProperty("minServerGen"))
                    if (typeof message.minServerGen === "number")
                        object.minServerGen = options.longs === String ? String(message.minServerGen) : message.minServerGen;
                    else
                        object.minServerGen = options.longs === String ? $util.Long.prototype.toString.call(message.minServerGen) : options.longs === Number ? new $util.LongBits(message.minServerGen.low >>> 0, message.minServerGen.high >>> 0).toNumber(true) : message.minServerGen;
                if (message.serverGen != null && message.hasOwnProperty("serverGen"))
                    if (typeof message.serverGen === "number")
                        object.serverGen = options.longs === String ? String(message.serverGen) : message.serverGen;
                    else
                        object.serverGen = options.longs === String ? $util.Long.prototype.toString.call(message.serverGen) : options.longs === Number ? new $util.LongBits(message.serverGen.low >>> 0, message.serverGen.high >>> 0).toNumber(true) : message.serverGen;
                return object;
            };

            ServerGens.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            ServerGens.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.ServerGens";
            };

            return ServerGens;
        })();

        FeatureCollectionPBuffer.Scale = (function() {

            function Scale(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Scale.prototype.xScale = 0;
            Scale.prototype.yScale = 0;
            Scale.prototype.mScale = 0;
            Scale.prototype.zScale = 0;

            Scale.create = function create(properties) {
                return new Scale(properties);
            };

            Scale.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.xScale != null && Object.hasOwnProperty.call(message, "xScale"))
                    writer.uint32(9).double(message.xScale);
                if (message.yScale != null && Object.hasOwnProperty.call(message, "yScale"))
                    writer.uint32(17).double(message.yScale);
                if (message.mScale != null && Object.hasOwnProperty.call(message, "mScale"))
                    writer.uint32(25).double(message.mScale);
                if (message.zScale != null && Object.hasOwnProperty.call(message, "zScale"))
                    writer.uint32(33).double(message.zScale);
                return writer;
            };

            Scale.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Scale.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.xScale != null && message.hasOwnProperty("xScale"))
                    if (typeof message.xScale !== "number")
                        return "xScale: number expected";
                if (message.yScale != null && message.hasOwnProperty("yScale"))
                    if (typeof message.yScale !== "number")
                        return "yScale: number expected";
                if (message.mScale != null && message.hasOwnProperty("mScale"))
                    if (typeof message.mScale !== "number")
                        return "mScale: number expected";
                if (message.zScale != null && message.hasOwnProperty("zScale"))
                    if (typeof message.zScale !== "number")
                        return "zScale: number expected";
                return null;
            };

            Scale.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Scale)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Scale();
                if (object.xScale != null)
                    message.xScale = Number(object.xScale);
                if (object.yScale != null)
                    message.yScale = Number(object.yScale);
                if (object.mScale != null)
                    message.mScale = Number(object.mScale);
                if (object.zScale != null)
                    message.zScale = Number(object.zScale);
                return message;
            };

            Scale.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.xScale = 0;
                    object.yScale = 0;
                    object.mScale = 0;
                    object.zScale = 0;
                }
                if (message.xScale != null && message.hasOwnProperty("xScale"))
                    object.xScale = options.json && !isFinite(message.xScale) ? String(message.xScale) : message.xScale;
                if (message.yScale != null && message.hasOwnProperty("yScale"))
                    object.yScale = options.json && !isFinite(message.yScale) ? String(message.yScale) : message.yScale;
                if (message.mScale != null && message.hasOwnProperty("mScale"))
                    object.mScale = options.json && !isFinite(message.mScale) ? String(message.mScale) : message.mScale;
                if (message.zScale != null && message.hasOwnProperty("zScale"))
                    object.zScale = options.json && !isFinite(message.zScale) ? String(message.zScale) : message.zScale;
                return object;
            };

            Scale.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Scale.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Scale";
            };

            return Scale;
        })();

        FeatureCollectionPBuffer.Translate = (function() {

            function Translate(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Translate.prototype.xTranslate = 0;
            Translate.prototype.yTranslate = 0;
            Translate.prototype.mTranslate = 0;
            Translate.prototype.zTranslate = 0;

            Translate.create = function create(properties) {
                return new Translate(properties);
            };

            Translate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.xTranslate != null && Object.hasOwnProperty.call(message, "xTranslate"))
                    writer.uint32(9).double(message.xTranslate);
                if (message.yTranslate != null && Object.hasOwnProperty.call(message, "yTranslate"))
                    writer.uint32(17).double(message.yTranslate);
                if (message.mTranslate != null && Object.hasOwnProperty.call(message, "mTranslate"))
                    writer.uint32(25).double(message.mTranslate);
                if (message.zTranslate != null && Object.hasOwnProperty.call(message, "zTranslate"))
                    writer.uint32(33).double(message.zTranslate);
                return writer;
            };

            Translate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Translate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.xTranslate != null && message.hasOwnProperty("xTranslate"))
                    if (typeof message.xTranslate !== "number")
                        return "xTranslate: number expected";
                if (message.yTranslate != null && message.hasOwnProperty("yTranslate"))
                    if (typeof message.yTranslate !== "number")
                        return "yTranslate: number expected";
                if (message.mTranslate != null && message.hasOwnProperty("mTranslate"))
                    if (typeof message.mTranslate !== "number")
                        return "mTranslate: number expected";
                if (message.zTranslate != null && message.hasOwnProperty("zTranslate"))
                    if (typeof message.zTranslate !== "number")
                        return "zTranslate: number expected";
                return null;
            };

            Translate.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Translate)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Translate();
                if (object.xTranslate != null)
                    message.xTranslate = Number(object.xTranslate);
                if (object.yTranslate != null)
                    message.yTranslate = Number(object.yTranslate);
                if (object.mTranslate != null)
                    message.mTranslate = Number(object.mTranslate);
                if (object.zTranslate != null)
                    message.zTranslate = Number(object.zTranslate);
                return message;
            };

            Translate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.xTranslate = 0;
                    object.yTranslate = 0;
                    object.mTranslate = 0;
                    object.zTranslate = 0;
                }
                if (message.xTranslate != null && message.hasOwnProperty("xTranslate"))
                    object.xTranslate = options.json && !isFinite(message.xTranslate) ? String(message.xTranslate) : message.xTranslate;
                if (message.yTranslate != null && message.hasOwnProperty("yTranslate"))
                    object.yTranslate = options.json && !isFinite(message.yTranslate) ? String(message.yTranslate) : message.yTranslate;
                if (message.mTranslate != null && message.hasOwnProperty("mTranslate"))
                    object.mTranslate = options.json && !isFinite(message.mTranslate) ? String(message.mTranslate) : message.mTranslate;
                if (message.zTranslate != null && message.hasOwnProperty("zTranslate"))
                    object.zTranslate = options.json && !isFinite(message.zTranslate) ? String(message.zTranslate) : message.zTranslate;
                return object;
            };

            Translate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Translate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Translate";
            };

            return Translate;
        })();

        FeatureCollectionPBuffer.Transform = (function() {

            function Transform(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            Transform.prototype.quantizeOriginPostion = 0;
            Transform.prototype.scale = null;
            Transform.prototype.translate = null;

            Transform.create = function create(properties) {
                return new Transform(properties);
            };

            Transform.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.quantizeOriginPostion != null && Object.hasOwnProperty.call(message, "quantizeOriginPostion"))
                    writer.uint32(8).int32(message.quantizeOriginPostion);
                if (message.scale != null && Object.hasOwnProperty.call(message, "scale"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Scale.encode(message.scale, writer.uint32(18).fork()).ldelim();
                if (message.translate != null && Object.hasOwnProperty.call(message, "translate"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Translate.encode(message.translate, writer.uint32(26).fork()).ldelim();
                return writer;
            };

            Transform.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            Transform.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.quantizeOriginPostion != null && message.hasOwnProperty("quantizeOriginPostion"))
                    switch (message.quantizeOriginPostion) {
                    default:
                        return "quantizeOriginPostion: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.scale != null && message.hasOwnProperty("scale")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.Scale.verify(message.scale);
                    if (error)
                        return "scale." + error;
                }
                if (message.translate != null && message.hasOwnProperty("translate")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.Translate.verify(message.translate);
                    if (error)
                        return "translate." + error;
                }
                return null;
            };

            Transform.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Transform)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Transform();
                switch (object.quantizeOriginPostion) {
                default:
                    if (typeof object.quantizeOriginPostion === "number") {
                        message.quantizeOriginPostion = object.quantizeOriginPostion;
                        break;
                    }
                    break;
                case "upperLeft":
                case 0:
                    message.quantizeOriginPostion = 0;
                    break;
                case "lowerLeft":
                case 1:
                    message.quantizeOriginPostion = 1;
                    break;
                }
                if (object.scale != null) {
                    if (typeof object.scale !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Transform.scale: object expected");
                    message.scale = $root.esriPBuffer.FeatureCollectionPBuffer.Scale.fromObject(object.scale);
                }
                if (object.translate != null) {
                    if (typeof object.translate !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.Transform.translate: object expected");
                    message.translate = $root.esriPBuffer.FeatureCollectionPBuffer.Translate.fromObject(object.translate);
                }
                return message;
            };

            Transform.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.quantizeOriginPostion = options.enums === String ? "upperLeft" : 0;
                    object.scale = null;
                    object.translate = null;
                }
                if (message.quantizeOriginPostion != null && message.hasOwnProperty("quantizeOriginPostion"))
                    object.quantizeOriginPostion = options.enums === String ? $root.esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion[message.quantizeOriginPostion] === undefined ? message.quantizeOriginPostion : $root.esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion[message.quantizeOriginPostion] : message.quantizeOriginPostion;
                if (message.scale != null && message.hasOwnProperty("scale"))
                    object.scale = $root.esriPBuffer.FeatureCollectionPBuffer.Scale.toObject(message.scale, options);
                if (message.translate != null && message.hasOwnProperty("translate"))
                    object.translate = $root.esriPBuffer.FeatureCollectionPBuffer.Translate.toObject(message.translate, options);
                return object;
            };

            Transform.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            Transform.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.Transform";
            };

            return Transform;
        })();

        FeatureCollectionPBuffer.FeatureResult = (function() {

            function FeatureResult(properties) {
                this.fields = [];
                this.values = [];
                this.features = [];
                this.geometryFields = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            FeatureResult.prototype.objectIdFieldName = "";
            FeatureResult.prototype.uniqueIdField = null;
            FeatureResult.prototype.globalIdFieldName = "";
            FeatureResult.prototype.geohashFieldName = "";
            FeatureResult.prototype.geometryProperties = null;
            FeatureResult.prototype.serverGens = null;
            FeatureResult.prototype.geometryType = 0;
            FeatureResult.prototype.spatialReference = null;
            FeatureResult.prototype.exceededTransferLimit = false;
            FeatureResult.prototype.hasZ = false;
            FeatureResult.prototype.hasM = false;
            FeatureResult.prototype.transform = null;
            FeatureResult.prototype.fields = $util.emptyArray;
            FeatureResult.prototype.values = $util.emptyArray;
            FeatureResult.prototype.features = $util.emptyArray;
            FeatureResult.prototype.geometryFields = $util.emptyArray;

            FeatureResult.create = function create(properties) {
                return new FeatureResult(properties);
            };

            FeatureResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.objectIdFieldName != null && Object.hasOwnProperty.call(message, "objectIdFieldName"))
                    writer.uint32(10).string(message.objectIdFieldName);
                if (message.uniqueIdField != null && Object.hasOwnProperty.call(message, "uniqueIdField"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.encode(message.uniqueIdField, writer.uint32(18).fork()).ldelim();
                if (message.globalIdFieldName != null && Object.hasOwnProperty.call(message, "globalIdFieldName"))
                    writer.uint32(26).string(message.globalIdFieldName);
                if (message.geohashFieldName != null && Object.hasOwnProperty.call(message, "geohashFieldName"))
                    writer.uint32(34).string(message.geohashFieldName);
                if (message.geometryProperties != null && Object.hasOwnProperty.call(message, "geometryProperties"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.encode(message.geometryProperties, writer.uint32(42).fork()).ldelim();
                if (message.serverGens != null && Object.hasOwnProperty.call(message, "serverGens"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.encode(message.serverGens, writer.uint32(50).fork()).ldelim();
                if (message.geometryType != null && Object.hasOwnProperty.call(message, "geometryType"))
                    writer.uint32(56).int32(message.geometryType);
                if (message.spatialReference != null && Object.hasOwnProperty.call(message, "spatialReference"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.encode(message.spatialReference, writer.uint32(66).fork()).ldelim();
                if (message.exceededTransferLimit != null && Object.hasOwnProperty.call(message, "exceededTransferLimit"))
                    writer.uint32(72).bool(message.exceededTransferLimit);
                if (message.hasZ != null && Object.hasOwnProperty.call(message, "hasZ"))
                    writer.uint32(80).bool(message.hasZ);
                if (message.hasM != null && Object.hasOwnProperty.call(message, "hasM"))
                    writer.uint32(88).bool(message.hasM);
                if (message.transform != null && Object.hasOwnProperty.call(message, "transform"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.Transform.encode(message.transform, writer.uint32(98).fork()).ldelim();
                if (message.fields != null && message.fields.length)
                    for (var i = 0; i < message.fields.length; ++i)
                        $root.esriPBuffer.FeatureCollectionPBuffer.Field.encode(message.fields[i], writer.uint32(106).fork()).ldelim();
                if (message.values != null && message.values.length)
                    for (var i = 0; i < message.values.length; ++i)
                        $root.esriPBuffer.FeatureCollectionPBuffer.Value.encode(message.values[i], writer.uint32(114).fork()).ldelim();
                if (message.features != null && message.features.length)
                    for (var i = 0; i < message.features.length; ++i)
                        $root.esriPBuffer.FeatureCollectionPBuffer.Feature.encode(message.features[i], writer.uint32(122).fork()).ldelim();
                if (message.geometryFields != null && message.geometryFields.length)
                    for (var i = 0; i < message.geometryFields.length; ++i)
                        $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.encode(message.geometryFields[i], writer.uint32(130).fork()).ldelim();
                return writer;
            };

            FeatureResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            FeatureResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.objectIdFieldName != null && message.hasOwnProperty("objectIdFieldName"))
                    if (!$util.isString(message.objectIdFieldName))
                        return "objectIdFieldName: string expected";
                if (message.uniqueIdField != null && message.hasOwnProperty("uniqueIdField")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.verify(message.uniqueIdField);
                    if (error)
                        return "uniqueIdField." + error;
                }
                if (message.globalIdFieldName != null && message.hasOwnProperty("globalIdFieldName"))
                    if (!$util.isString(message.globalIdFieldName))
                        return "globalIdFieldName: string expected";
                if (message.geohashFieldName != null && message.hasOwnProperty("geohashFieldName"))
                    if (!$util.isString(message.geohashFieldName))
                        return "geohashFieldName: string expected";
                if (message.geometryProperties != null && message.hasOwnProperty("geometryProperties")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.verify(message.geometryProperties);
                    if (error)
                        return "geometryProperties." + error;
                }
                if (message.serverGens != null && message.hasOwnProperty("serverGens")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.verify(message.serverGens);
                    if (error)
                        return "serverGens." + error;
                }
                if (message.geometryType != null && message.hasOwnProperty("geometryType"))
                    switch (message.geometryType) {
                    default:
                        return "geometryType: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 127:
                    case 5:
                        break;
                    }
                if (message.spatialReference != null && message.hasOwnProperty("spatialReference")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.verify(message.spatialReference);
                    if (error)
                        return "spatialReference." + error;
                }
                if (message.exceededTransferLimit != null && message.hasOwnProperty("exceededTransferLimit"))
                    if (typeof message.exceededTransferLimit !== "boolean")
                        return "exceededTransferLimit: boolean expected";
                if (message.hasZ != null && message.hasOwnProperty("hasZ"))
                    if (typeof message.hasZ !== "boolean")
                        return "hasZ: boolean expected";
                if (message.hasM != null && message.hasOwnProperty("hasM"))
                    if (typeof message.hasM !== "boolean")
                        return "hasM: boolean expected";
                if (message.transform != null && message.hasOwnProperty("transform")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.Transform.verify(message.transform);
                    if (error)
                        return "transform." + error;
                }
                if (message.fields != null && message.hasOwnProperty("fields")) {
                    if (!Array.isArray(message.fields))
                        return "fields: array expected";
                    for (var i = 0; i < message.fields.length; ++i) {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.Field.verify(message.fields[i]);
                        if (error)
                            return "fields." + error;
                    }
                }
                if (message.values != null && message.hasOwnProperty("values")) {
                    if (!Array.isArray(message.values))
                        return "values: array expected";
                    for (var i = 0; i < message.values.length; ++i) {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.Value.verify(message.values[i]);
                        if (error)
                            return "values." + error;
                    }
                }
                if (message.features != null && message.hasOwnProperty("features")) {
                    if (!Array.isArray(message.features))
                        return "features: array expected";
                    for (var i = 0; i < message.features.length; ++i) {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.Feature.verify(message.features[i]);
                        if (error)
                            return "features." + error;
                    }
                }
                if (message.geometryFields != null && message.hasOwnProperty("geometryFields")) {
                    if (!Array.isArray(message.geometryFields))
                        return "geometryFields: array expected";
                    for (var i = 0; i < message.geometryFields.length; ++i) {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.verify(message.geometryFields[i]);
                        if (error)
                            return "geometryFields." + error;
                    }
                }
                return null;
            };

            FeatureResult.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult();
                if (object.objectIdFieldName != null)
                    message.objectIdFieldName = String(object.objectIdFieldName);
                if (object.uniqueIdField != null) {
                    if (typeof object.uniqueIdField !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.uniqueIdField: object expected");
                    message.uniqueIdField = $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.fromObject(object.uniqueIdField);
                }
                if (object.globalIdFieldName != null)
                    message.globalIdFieldName = String(object.globalIdFieldName);
                if (object.geohashFieldName != null)
                    message.geohashFieldName = String(object.geohashFieldName);
                if (object.geometryProperties != null) {
                    if (typeof object.geometryProperties !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.geometryProperties: object expected");
                    message.geometryProperties = $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.fromObject(object.geometryProperties);
                }
                if (object.serverGens != null) {
                    if (typeof object.serverGens !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.serverGens: object expected");
                    message.serverGens = $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.fromObject(object.serverGens);
                }
                switch (object.geometryType) {
                default:
                    if (typeof object.geometryType === "number") {
                        message.geometryType = object.geometryType;
                        break;
                    }
                    break;
                case "esriGeometryTypePoint":
                case 0:
                    message.geometryType = 0;
                    break;
                case "esriGeometryTypeMultipoint":
                case 1:
                    message.geometryType = 1;
                    break;
                case "esriGeometryTypePolyline":
                case 2:
                    message.geometryType = 2;
                    break;
                case "esriGeometryTypePolygon":
                case 3:
                    message.geometryType = 3;
                    break;
                case "esriGeometryTypeMultipatch":
                case 4:
                    message.geometryType = 4;
                    break;
                case "esriGeometryTypeNone":
                case 127:
                    message.geometryType = 127;
                    break;
                case "esriGeometryTypeEnvelope":
                case 5:
                    message.geometryType = 5;
                    break;
                }
                if (object.spatialReference != null) {
                    if (typeof object.spatialReference !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.spatialReference: object expected");
                    message.spatialReference = $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.fromObject(object.spatialReference);
                }
                if (object.exceededTransferLimit != null)
                    message.exceededTransferLimit = Boolean(object.exceededTransferLimit);
                if (object.hasZ != null)
                    message.hasZ = Boolean(object.hasZ);
                if (object.hasM != null)
                    message.hasM = Boolean(object.hasM);
                if (object.transform != null) {
                    if (typeof object.transform !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.transform: object expected");
                    message.transform = $root.esriPBuffer.FeatureCollectionPBuffer.Transform.fromObject(object.transform);
                }
                if (object.fields) {
                    if (!Array.isArray(object.fields))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.fields: array expected");
                    message.fields = [];
                    for (var i = 0; i < object.fields.length; ++i) {
                        if (typeof object.fields[i] !== "object")
                            throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.fields: object expected");
                        message.fields[i] = $root.esriPBuffer.FeatureCollectionPBuffer.Field.fromObject(object.fields[i]);
                    }
                }
                if (object.values) {
                    if (!Array.isArray(object.values))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.values: array expected");
                    message.values = [];
                    for (var i = 0; i < object.values.length; ++i) {
                        if (typeof object.values[i] !== "object")
                            throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.values: object expected");
                        message.values[i] = $root.esriPBuffer.FeatureCollectionPBuffer.Value.fromObject(object.values[i]);
                    }
                }
                if (object.features) {
                    if (!Array.isArray(object.features))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.features: array expected");
                    message.features = [];
                    for (var i = 0; i < object.features.length; ++i) {
                        if (typeof object.features[i] !== "object")
                            throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.features: object expected");
                        message.features[i] = $root.esriPBuffer.FeatureCollectionPBuffer.Feature.fromObject(object.features[i]);
                    }
                }
                if (object.geometryFields) {
                    if (!Array.isArray(object.geometryFields))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.geometryFields: array expected");
                    message.geometryFields = [];
                    for (var i = 0; i < object.geometryFields.length; ++i) {
                        if (typeof object.geometryFields[i] !== "object")
                            throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.FeatureResult.geometryFields: object expected");
                        message.geometryFields[i] = $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.fromObject(object.geometryFields[i]);
                    }
                }
                return message;
            };

            FeatureResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.fields = [];
                    object.values = [];
                    object.features = [];
                    object.geometryFields = [];
                }
                if (options.defaults) {
                    object.objectIdFieldName = "";
                    object.uniqueIdField = null;
                    object.globalIdFieldName = "";
                    object.geohashFieldName = "";
                    object.geometryProperties = null;
                    object.serverGens = null;
                    object.geometryType = options.enums === String ? "esriGeometryTypePoint" : 0;
                    object.spatialReference = null;
                    object.exceededTransferLimit = false;
                    object.hasZ = false;
                    object.hasM = false;
                    object.transform = null;
                }
                if (message.objectIdFieldName != null && message.hasOwnProperty("objectIdFieldName"))
                    object.objectIdFieldName = message.objectIdFieldName;
                if (message.uniqueIdField != null && message.hasOwnProperty("uniqueIdField"))
                    object.uniqueIdField = $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.toObject(message.uniqueIdField, options);
                if (message.globalIdFieldName != null && message.hasOwnProperty("globalIdFieldName"))
                    object.globalIdFieldName = message.globalIdFieldName;
                if (message.geohashFieldName != null && message.hasOwnProperty("geohashFieldName"))
                    object.geohashFieldName = message.geohashFieldName;
                if (message.geometryProperties != null && message.hasOwnProperty("geometryProperties"))
                    object.geometryProperties = $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.toObject(message.geometryProperties, options);
                if (message.serverGens != null && message.hasOwnProperty("serverGens"))
                    object.serverGens = $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.toObject(message.serverGens, options);
                if (message.geometryType != null && message.hasOwnProperty("geometryType"))
                    object.geometryType = options.enums === String ? $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[message.geometryType] === undefined ? message.geometryType : $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[message.geometryType] : message.geometryType;
                if (message.spatialReference != null && message.hasOwnProperty("spatialReference"))
                    object.spatialReference = $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.toObject(message.spatialReference, options);
                if (message.exceededTransferLimit != null && message.hasOwnProperty("exceededTransferLimit"))
                    object.exceededTransferLimit = message.exceededTransferLimit;
                if (message.hasZ != null && message.hasOwnProperty("hasZ"))
                    object.hasZ = message.hasZ;
                if (message.hasM != null && message.hasOwnProperty("hasM"))
                    object.hasM = message.hasM;
                if (message.transform != null && message.hasOwnProperty("transform"))
                    object.transform = $root.esriPBuffer.FeatureCollectionPBuffer.Transform.toObject(message.transform, options);
                if (message.fields && message.fields.length) {
                    object.fields = [];
                    for (var j = 0; j < message.fields.length; ++j)
                        object.fields[j] = $root.esriPBuffer.FeatureCollectionPBuffer.Field.toObject(message.fields[j], options);
                }
                if (message.values && message.values.length) {
                    object.values = [];
                    for (var j = 0; j < message.values.length; ++j)
                        object.values[j] = $root.esriPBuffer.FeatureCollectionPBuffer.Value.toObject(message.values[j], options);
                }
                if (message.features && message.features.length) {
                    object.features = [];
                    for (var j = 0; j < message.features.length; ++j)
                        object.features[j] = $root.esriPBuffer.FeatureCollectionPBuffer.Feature.toObject(message.features[j], options);
                }
                if (message.geometryFields && message.geometryFields.length) {
                    object.geometryFields = [];
                    for (var j = 0; j < message.geometryFields.length; ++j)
                        object.geometryFields[j] = $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.toObject(message.geometryFields[j], options);
                }
                return object;
            };

            FeatureResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            FeatureResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.FeatureResult";
            };

            return FeatureResult;
        })();

        FeatureCollectionPBuffer.CountResult = (function() {

            function CountResult(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            CountResult.prototype.count = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            CountResult.create = function create(properties) {
                return new CountResult(properties);
            };

            CountResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.count != null && Object.hasOwnProperty.call(message, "count"))
                    writer.uint32(8).uint64(message.count);
                return writer;
            };

            CountResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            CountResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.count != null && message.hasOwnProperty("count"))
                    if (!$util.isInteger(message.count) && !(message.count && $util.isInteger(message.count.low) && $util.isInteger(message.count.high)))
                        return "count: integer|Long expected";
                return null;
            };

            CountResult.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.CountResult)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.CountResult();
                if (object.count != null)
                    if ($util.Long)
                        (message.count = $util.Long.fromValue(object.count)).unsigned = true;
                    else if (typeof object.count === "string")
                        message.count = parseInt(object.count, 10);
                    else if (typeof object.count === "number")
                        message.count = object.count;
                    else if (typeof object.count === "object")
                        message.count = new $util.LongBits(object.count.low >>> 0, object.count.high >>> 0).toNumber(true);
                return message;
            };

            CountResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.count = options.longs === String ? "0" : 0;
                if (message.count != null && message.hasOwnProperty("count"))
                    if (typeof message.count === "number")
                        object.count = options.longs === String ? String(message.count) : message.count;
                    else
                        object.count = options.longs === String ? $util.Long.prototype.toString.call(message.count) : options.longs === Number ? new $util.LongBits(message.count.low >>> 0, message.count.high >>> 0).toNumber(true) : message.count;
                return object;
            };

            CountResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            CountResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.CountResult";
            };

            return CountResult;
        })();

        FeatureCollectionPBuffer.ObjectIdsResult = (function() {

            function ObjectIdsResult(properties) {
                this.objectIds = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            ObjectIdsResult.prototype.objectIdFieldName = "";
            ObjectIdsResult.prototype.serverGens = null;
            ObjectIdsResult.prototype.objectIds = $util.emptyArray;

            ObjectIdsResult.create = function create(properties) {
                return new ObjectIdsResult(properties);
            };

            ObjectIdsResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.objectIdFieldName != null && Object.hasOwnProperty.call(message, "objectIdFieldName"))
                    writer.uint32(10).string(message.objectIdFieldName);
                if (message.serverGens != null && Object.hasOwnProperty.call(message, "serverGens"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.encode(message.serverGens, writer.uint32(18).fork()).ldelim();
                if (message.objectIds != null && message.objectIds.length) {
                    writer.uint32(26).fork();
                    for (var i = 0; i < message.objectIds.length; ++i)
                        writer.uint64(message.objectIds[i]);
                    writer.ldelim();
                }
                return writer;
            };

            ObjectIdsResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            ObjectIdsResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.objectIdFieldName != null && message.hasOwnProperty("objectIdFieldName"))
                    if (!$util.isString(message.objectIdFieldName))
                        return "objectIdFieldName: string expected";
                if (message.serverGens != null && message.hasOwnProperty("serverGens")) {
                    var error = $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.verify(message.serverGens);
                    if (error)
                        return "serverGens." + error;
                }
                if (message.objectIds != null && message.hasOwnProperty("objectIds")) {
                    if (!Array.isArray(message.objectIds))
                        return "objectIds: array expected";
                    for (var i = 0; i < message.objectIds.length; ++i)
                        if (!$util.isInteger(message.objectIds[i]) && !(message.objectIds[i] && $util.isInteger(message.objectIds[i].low) && $util.isInteger(message.objectIds[i].high)))
                            return "objectIds: integer|Long[] expected";
                }
                return null;
            };

            ObjectIdsResult.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult();
                if (object.objectIdFieldName != null)
                    message.objectIdFieldName = String(object.objectIdFieldName);
                if (object.serverGens != null) {
                    if (typeof object.serverGens !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.serverGens: object expected");
                    message.serverGens = $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.fromObject(object.serverGens);
                }
                if (object.objectIds) {
                    if (!Array.isArray(object.objectIds))
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.objectIds: array expected");
                    message.objectIds = [];
                    for (var i = 0; i < object.objectIds.length; ++i)
                        if ($util.Long)
                            (message.objectIds[i] = $util.Long.fromValue(object.objectIds[i])).unsigned = true;
                        else if (typeof object.objectIds[i] === "string")
                            message.objectIds[i] = parseInt(object.objectIds[i], 10);
                        else if (typeof object.objectIds[i] === "number")
                            message.objectIds[i] = object.objectIds[i];
                        else if (typeof object.objectIds[i] === "object")
                            message.objectIds[i] = new $util.LongBits(object.objectIds[i].low >>> 0, object.objectIds[i].high >>> 0).toNumber(true);
                }
                return message;
            };

            ObjectIdsResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.objectIds = [];
                if (options.defaults) {
                    object.objectIdFieldName = "";
                    object.serverGens = null;
                }
                if (message.objectIdFieldName != null && message.hasOwnProperty("objectIdFieldName"))
                    object.objectIdFieldName = message.objectIdFieldName;
                if (message.serverGens != null && message.hasOwnProperty("serverGens"))
                    object.serverGens = $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.toObject(message.serverGens, options);
                if (message.objectIds && message.objectIds.length) {
                    object.objectIds = [];
                    for (var j = 0; j < message.objectIds.length; ++j)
                        if (typeof message.objectIds[j] === "number")
                            object.objectIds[j] = options.longs === String ? String(message.objectIds[j]) : message.objectIds[j];
                        else
                            object.objectIds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.objectIds[j]) : options.longs === Number ? new $util.LongBits(message.objectIds[j].low >>> 0, message.objectIds[j].high >>> 0).toNumber(true) : message.objectIds[j];
                }
                return object;
            };

            ObjectIdsResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            ObjectIdsResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult";
            };

            return ObjectIdsResult;
        })();

        FeatureCollectionPBuffer.QueryResult = (function() {

            function QueryResult(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            QueryResult.prototype.featureResult = null;
            QueryResult.prototype.countResult = null;
            QueryResult.prototype.idsResult = null;

            var $oneOfFields;

            Object.defineProperty(QueryResult.prototype, "Results", {
                get: $util.oneOfGetter($oneOfFields = ["featureResult", "countResult", "idsResult"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            QueryResult.create = function create(properties) {
                return new QueryResult(properties);
            };

            QueryResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.featureResult != null && Object.hasOwnProperty.call(message, "featureResult"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.encode(message.featureResult, writer.uint32(10).fork()).ldelim();
                if (message.countResult != null && Object.hasOwnProperty.call(message, "countResult"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.encode(message.countResult, writer.uint32(18).fork()).ldelim();
                if (message.idsResult != null && Object.hasOwnProperty.call(message, "idsResult"))
                    $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.encode(message.idsResult, writer.uint32(26).fork()).ldelim();
                return writer;
            };

            QueryResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            QueryResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.featureResult != null && message.hasOwnProperty("featureResult")) {
                    properties.Results = 1;
                    {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.verify(message.featureResult);
                        if (error)
                            return "featureResult." + error;
                    }
                }
                if (message.countResult != null && message.hasOwnProperty("countResult")) {
                    if (properties.Results === 1)
                        return "Results: multiple values";
                    properties.Results = 1;
                    {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.verify(message.countResult);
                        if (error)
                            return "countResult." + error;
                    }
                }
                if (message.idsResult != null && message.hasOwnProperty("idsResult")) {
                    if (properties.Results === 1)
                        return "Results: multiple values";
                    properties.Results = 1;
                    {
                        var error = $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.verify(message.idsResult);
                        if (error)
                            return "idsResult." + error;
                    }
                }
                return null;
            };

            QueryResult.fromObject = function fromObject(object) {
                if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult)
                    return object;
                var message = new $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult();
                if (object.featureResult != null) {
                    if (typeof object.featureResult !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.QueryResult.featureResult: object expected");
                    message.featureResult = $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.fromObject(object.featureResult);
                }
                if (object.countResult != null) {
                    if (typeof object.countResult !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.QueryResult.countResult: object expected");
                    message.countResult = $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.fromObject(object.countResult);
                }
                if (object.idsResult != null) {
                    if (typeof object.idsResult !== "object")
                        throw TypeError(".esriPBuffer.FeatureCollectionPBuffer.QueryResult.idsResult: object expected");
                    message.idsResult = $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.fromObject(object.idsResult);
                }
                return message;
            };

            QueryResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.featureResult != null && message.hasOwnProperty("featureResult")) {
                    object.featureResult = $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.toObject(message.featureResult, options);
                    if (options.oneofs)
                        object.Results = "featureResult";
                }
                if (message.countResult != null && message.hasOwnProperty("countResult")) {
                    object.countResult = $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.toObject(message.countResult, options);
                    if (options.oneofs)
                        object.Results = "countResult";
                }
                if (message.idsResult != null && message.hasOwnProperty("idsResult")) {
                    object.idsResult = $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.toObject(message.idsResult, options);
                    if (options.oneofs)
                        object.Results = "idsResult";
                }
                return object;
            };

            QueryResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            QueryResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esriPBuffer.FeatureCollectionPBuffer.QueryResult";
            };

            return QueryResult;
        })();

        return FeatureCollectionPBuffer;
    })();

    return esriPBuffer;
})();

module.exports = $root;
