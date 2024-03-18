/* eslint-disable */
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
'use strict';

var $protobuf = require('protobufjs/minimal');

// Common aliases
var $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {});

$root.esriPBuffer = (function () {
  /**
   * Namespace esriPBuffer.
   * @exports esriPBuffer
   * @namespace
   */
  var esriPBuffer = {};

  esriPBuffer.FeatureCollectionPBuffer = (function () {
    /**
     * Properties of a FeatureCollectionPBuffer.
     * @memberof esriPBuffer
     * @interface IFeatureCollectionPBuffer
     * @property {string|null} [version] FeatureCollectionPBuffer version
     * @property {esriPBuffer.FeatureCollectionPBuffer.IQueryResult|null} [queryResult] FeatureCollectionPBuffer queryResult
     */

    /**
     * Constructs a new FeatureCollectionPBuffer.
     * @memberof esriPBuffer
     * @classdesc Represents a FeatureCollectionPBuffer.
     * @implements IFeatureCollectionPBuffer
     * @constructor
     * @param {esriPBuffer.IFeatureCollectionPBuffer=} [properties] Properties to set
     */
    function FeatureCollectionPBuffer(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * FeatureCollectionPBuffer version.
     * @member {string} version
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @instance
     */
    FeatureCollectionPBuffer.prototype.version = '';

    /**
     * FeatureCollectionPBuffer queryResult.
     * @member {esriPBuffer.FeatureCollectionPBuffer.IQueryResult|null|undefined} queryResult
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @instance
     */
    FeatureCollectionPBuffer.prototype.queryResult = null;

    /**
     * Creates a new FeatureCollectionPBuffer instance using the specified properties.
     * @function create
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {esriPBuffer.IFeatureCollectionPBuffer=} [properties] Properties to set
     * @returns {esriPBuffer.FeatureCollectionPBuffer} FeatureCollectionPBuffer instance
     */
    FeatureCollectionPBuffer.create = function create(properties) {
      return new FeatureCollectionPBuffer(properties);
    };

    /**
     * Encodes the specified FeatureCollectionPBuffer message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.verify|verify} messages.
     * @function encode
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {esriPBuffer.IFeatureCollectionPBuffer} message FeatureCollectionPBuffer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    FeatureCollectionPBuffer.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.version != null &&
        Object.hasOwnProperty.call(message, 'version')
      )
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.version);
      if (
        message.queryResult != null &&
        Object.hasOwnProperty.call(message, 'queryResult')
      )
        $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.encode(
          message.queryResult,
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified FeatureCollectionPBuffer message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.verify|verify} messages.
     * @function encodeDelimited
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {esriPBuffer.IFeatureCollectionPBuffer} message FeatureCollectionPBuffer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    FeatureCollectionPBuffer.encodeDelimited = function encodeDelimited(
      message,
      writer,
    ) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a FeatureCollectionPBuffer message from the specified reader or buffer.
     * @function decode
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {esriPBuffer.FeatureCollectionPBuffer} FeatureCollectionPBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    FeatureCollectionPBuffer.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.esriPBuffer.FeatureCollectionPBuffer();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            message.version = reader.string();
            break;
          }
          case 2: {
            message.queryResult =
              $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.decode(
                reader,
                reader.uint32(),
              );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a FeatureCollectionPBuffer message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {esriPBuffer.FeatureCollectionPBuffer} FeatureCollectionPBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    FeatureCollectionPBuffer.decodeDelimited = function decodeDelimited(
      reader,
    ) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a FeatureCollectionPBuffer message.
     * @function verify
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    FeatureCollectionPBuffer.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected';
      if (message.version != null && message.hasOwnProperty('version'))
        if (!$util.isString(message.version)) return 'version: string expected';
      if (
        message.queryResult != null &&
        message.hasOwnProperty('queryResult')
      ) {
        var error =
          $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.verify(
            message.queryResult,
          );
        if (error) return 'queryResult.' + error;
      }
      return null;
    };

    /**
     * Creates a FeatureCollectionPBuffer message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {esriPBuffer.FeatureCollectionPBuffer} FeatureCollectionPBuffer
     */
    FeatureCollectionPBuffer.fromObject = function fromObject(object) {
      if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer)
        return object;
      var message = new $root.esriPBuffer.FeatureCollectionPBuffer();
      if (object.version != null) message.version = String(object.version);
      if (object.queryResult != null) {
        if (typeof object.queryResult !== 'object')
          throw TypeError(
            '.esriPBuffer.FeatureCollectionPBuffer.queryResult: object expected',
          );
        message.queryResult =
          $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.fromObject(
            object.queryResult,
          );
      }
      return message;
    };

    /**
     * Creates a plain object from a FeatureCollectionPBuffer message. Also converts values to other types if specified.
     * @function toObject
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {esriPBuffer.FeatureCollectionPBuffer} message FeatureCollectionPBuffer
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    FeatureCollectionPBuffer.toObject = function toObject(message, options) {
      if (!options) options = {};
      var object = {};
      if (options.defaults) {
        object.version = '';
        object.queryResult = null;
      }
      if (message.version != null && message.hasOwnProperty('version'))
        object.version = message.version;
      if (message.queryResult != null && message.hasOwnProperty('queryResult'))
        object.queryResult =
          $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.toObject(
            message.queryResult,
            options,
          );
      return object;
    };

    /**
     * Converts this FeatureCollectionPBuffer to JSON.
     * @function toJSON
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    FeatureCollectionPBuffer.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for FeatureCollectionPBuffer
     * @function getTypeUrl
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    FeatureCollectionPBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = 'type.googleapis.com';
      }
      return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer';
    };

    /**
     * GeometryType enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.GeometryType
     * @enum {number}
     * @property {number} esriGeometryTypePoint=0 esriGeometryTypePoint value
     * @property {number} esriGeometryTypeMultipoint=1 esriGeometryTypeMultipoint value
     * @property {number} esriGeometryTypePolyline=2 esriGeometryTypePolyline value
     * @property {number} esriGeometryTypePolygon=3 esriGeometryTypePolygon value
     * @property {number} esriGeometryTypeMultipatch=4 esriGeometryTypeMultipatch value
     * @property {number} esriGeometryTypeNone=127 esriGeometryTypeNone value
     * @property {number} esriGeometryTypeEnvelope=5 esriGeometryTypeEnvelope value
     */
    FeatureCollectionPBuffer.GeometryType = (function () {
      var valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = 'esriGeometryTypePoint')] = 0;
      values[(valuesById[1] = 'esriGeometryTypeMultipoint')] = 1;
      values[(valuesById[2] = 'esriGeometryTypePolyline')] = 2;
      values[(valuesById[3] = 'esriGeometryTypePolygon')] = 3;
      values[(valuesById[4] = 'esriGeometryTypeMultipatch')] = 4;
      values[(valuesById[127] = 'esriGeometryTypeNone')] = 127;
      values[(valuesById[5] = 'esriGeometryTypeEnvelope')] = 5;
      return values;
    })();

    /**
     * FieldType enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.FieldType
     * @enum {number}
     * @property {number} esriFieldTypeSmallInteger=0 esriFieldTypeSmallInteger value
     * @property {number} esriFieldTypeInteger=1 esriFieldTypeInteger value
     * @property {number} esriFieldTypeSingle=2 esriFieldTypeSingle value
     * @property {number} esriFieldTypeDouble=3 esriFieldTypeDouble value
     * @property {number} esriFieldTypeString=4 esriFieldTypeString value
     * @property {number} esriFieldTypeDate=5 esriFieldTypeDate value
     * @property {number} esriFieldTypeOID=6 esriFieldTypeOID value
     * @property {number} esriFieldTypeGeometry=7 esriFieldTypeGeometry value
     * @property {number} esriFieldTypeBlob=8 esriFieldTypeBlob value
     * @property {number} esriFieldTypeRaster=9 esriFieldTypeRaster value
     * @property {number} esriFieldTypeGUID=10 esriFieldTypeGUID value
     * @property {number} esriFieldTypeGlobalID=11 esriFieldTypeGlobalID value
     * @property {number} esriFieldTypeXML=12 esriFieldTypeXML value
     * @property {number} esriFieldTypeBigInteger=13 esriFieldTypeBigInteger value
     * @property {number} esriFieldTypeDateOnly=14 esriFieldTypeDateOnly value
     * @property {number} esriFieldTypeTimeOnly=15 esriFieldTypeTimeOnly value
     * @property {number} esriFieldTypeTimestampOffset=16 esriFieldTypeTimestampOffset value
     */
    FeatureCollectionPBuffer.FieldType = (function () {
      var valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = 'esriFieldTypeSmallInteger')] = 0;
      values[(valuesById[1] = 'esriFieldTypeInteger')] = 1;
      values[(valuesById[2] = 'esriFieldTypeSingle')] = 2;
      values[(valuesById[3] = 'esriFieldTypeDouble')] = 3;
      values[(valuesById[4] = 'esriFieldTypeString')] = 4;
      values[(valuesById[5] = 'esriFieldTypeDate')] = 5;
      values[(valuesById[6] = 'esriFieldTypeOID')] = 6;
      values[(valuesById[7] = 'esriFieldTypeGeometry')] = 7;
      values[(valuesById[8] = 'esriFieldTypeBlob')] = 8;
      values[(valuesById[9] = 'esriFieldTypeRaster')] = 9;
      values[(valuesById[10] = 'esriFieldTypeGUID')] = 10;
      values[(valuesById[11] = 'esriFieldTypeGlobalID')] = 11;
      values[(valuesById[12] = 'esriFieldTypeXML')] = 12;
      values[(valuesById[13] = 'esriFieldTypeBigInteger')] = 13;
      values[(valuesById[14] = 'esriFieldTypeDateOnly')] = 14;
      values[(valuesById[15] = 'esriFieldTypeTimeOnly')] = 15;
      values[(valuesById[16] = 'esriFieldTypeTimestampOffset')] = 16;
      return values;
    })();

    /**
     * SQLType enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.SQLType
     * @enum {number}
     * @property {number} sqlTypeBigInt=0 sqlTypeBigInt value
     * @property {number} sqlTypeBinary=1 sqlTypeBinary value
     * @property {number} sqlTypeBit=2 sqlTypeBit value
     * @property {number} sqlTypeChar=3 sqlTypeChar value
     * @property {number} sqlTypeDate=4 sqlTypeDate value
     * @property {number} sqlTypeDecimal=5 sqlTypeDecimal value
     * @property {number} sqlTypeDouble=6 sqlTypeDouble value
     * @property {number} sqlTypeFloat=7 sqlTypeFloat value
     * @property {number} sqlTypeGeometry=8 sqlTypeGeometry value
     * @property {number} sqlTypeGUID=9 sqlTypeGUID value
     * @property {number} sqlTypeInteger=10 sqlTypeInteger value
     * @property {number} sqlTypeLongNVarchar=11 sqlTypeLongNVarchar value
     * @property {number} sqlTypeLongVarbinary=12 sqlTypeLongVarbinary value
     * @property {number} sqlTypeLongVarchar=13 sqlTypeLongVarchar value
     * @property {number} sqlTypeNChar=14 sqlTypeNChar value
     * @property {number} sqlTypeNVarchar=15 sqlTypeNVarchar value
     * @property {number} sqlTypeOther=16 sqlTypeOther value
     * @property {number} sqlTypeReal=17 sqlTypeReal value
     * @property {number} sqlTypeSmallInt=18 sqlTypeSmallInt value
     * @property {number} sqlTypeSqlXml=19 sqlTypeSqlXml value
     * @property {number} sqlTypeTime=20 sqlTypeTime value
     * @property {number} sqlTypeTimestamp=21 sqlTypeTimestamp value
     * @property {number} sqlTypeTimestamp2=22 sqlTypeTimestamp2 value
     * @property {number} sqlTypeTinyInt=23 sqlTypeTinyInt value
     * @property {number} sqlTypeVarbinary=24 sqlTypeVarbinary value
     * @property {number} sqlTypeVarchar=25 sqlTypeVarchar value
     * @property {number} sqlTypeTimestampWithTimezone=26 sqlTypeTimestampWithTimezone value
     */
    FeatureCollectionPBuffer.SQLType = (function () {
      var valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = 'sqlTypeBigInt')] = 0;
      values[(valuesById[1] = 'sqlTypeBinary')] = 1;
      values[(valuesById[2] = 'sqlTypeBit')] = 2;
      values[(valuesById[3] = 'sqlTypeChar')] = 3;
      values[(valuesById[4] = 'sqlTypeDate')] = 4;
      values[(valuesById[5] = 'sqlTypeDecimal')] = 5;
      values[(valuesById[6] = 'sqlTypeDouble')] = 6;
      values[(valuesById[7] = 'sqlTypeFloat')] = 7;
      values[(valuesById[8] = 'sqlTypeGeometry')] = 8;
      values[(valuesById[9] = 'sqlTypeGUID')] = 9;
      values[(valuesById[10] = 'sqlTypeInteger')] = 10;
      values[(valuesById[11] = 'sqlTypeLongNVarchar')] = 11;
      values[(valuesById[12] = 'sqlTypeLongVarbinary')] = 12;
      values[(valuesById[13] = 'sqlTypeLongVarchar')] = 13;
      values[(valuesById[14] = 'sqlTypeNChar')] = 14;
      values[(valuesById[15] = 'sqlTypeNVarchar')] = 15;
      values[(valuesById[16] = 'sqlTypeOther')] = 16;
      values[(valuesById[17] = 'sqlTypeReal')] = 17;
      values[(valuesById[18] = 'sqlTypeSmallInt')] = 18;
      values[(valuesById[19] = 'sqlTypeSqlXml')] = 19;
      values[(valuesById[20] = 'sqlTypeTime')] = 20;
      values[(valuesById[21] = 'sqlTypeTimestamp')] = 21;
      values[(valuesById[22] = 'sqlTypeTimestamp2')] = 22;
      values[(valuesById[23] = 'sqlTypeTinyInt')] = 23;
      values[(valuesById[24] = 'sqlTypeVarbinary')] = 24;
      values[(valuesById[25] = 'sqlTypeVarchar')] = 25;
      values[(valuesById[26] = 'sqlTypeTimestampWithTimezone')] = 26;
      return values;
    })();

    /**
     * QuantizeOriginPostion enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion
     * @enum {number}
     * @property {number} upperLeft=0 upperLeft value
     * @property {number} lowerLeft=1 lowerLeft value
     */
    FeatureCollectionPBuffer.QuantizeOriginPostion = (function () {
      var valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = 'upperLeft')] = 0;
      values[(valuesById[1] = 'lowerLeft')] = 1;
      return values;
    })();

    FeatureCollectionPBuffer.SpatialReference = (function () {
      /**
       * Properties of a SpatialReference.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ISpatialReference
       * @property {number|null} [wkid] SpatialReference wkid
       * @property {number|null} [lastestWkid] SpatialReference lastestWkid
       * @property {number|null} [vcsWkid] SpatialReference vcsWkid
       * @property {number|null} [latestVcsWkid] SpatialReference latestVcsWkid
       * @property {string|null} [wkt] SpatialReference wkt
       */

      /**
       * Constructs a new SpatialReference.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a SpatialReference.
       * @implements ISpatialReference
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference=} [properties] Properties to set
       */
      function SpatialReference(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * SpatialReference wkid.
       * @member {number} wkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.wkid = 0;

      /**
       * SpatialReference lastestWkid.
       * @member {number} lastestWkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.lastestWkid = 0;

      /**
       * SpatialReference vcsWkid.
       * @member {number} vcsWkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.vcsWkid = 0;

      /**
       * SpatialReference latestVcsWkid.
       * @member {number} latestVcsWkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.latestVcsWkid = 0;

      /**
       * SpatialReference wkt.
       * @member {string} wkt
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.wkt = '';

      /**
       * Creates a new SpatialReference instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.SpatialReference} SpatialReference instance
       */
      SpatialReference.create = function create(properties) {
        return new SpatialReference(properties);
      };

      /**
       * Encodes the specified SpatialReference message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.SpatialReference.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference} message SpatialReference message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      SpatialReference.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.wkid != null && Object.hasOwnProperty.call(message, 'wkid'))
          writer.uint32(/* id 1, wireType 0 =*/ 8).uint32(message.wkid);
        if (
          message.lastestWkid != null &&
          Object.hasOwnProperty.call(message, 'lastestWkid')
        )
          writer.uint32(/* id 2, wireType 0 =*/ 16).uint32(message.lastestWkid);
        if (
          message.vcsWkid != null &&
          Object.hasOwnProperty.call(message, 'vcsWkid')
        )
          writer.uint32(/* id 3, wireType 0 =*/ 24).uint32(message.vcsWkid);
        if (
          message.latestVcsWkid != null &&
          Object.hasOwnProperty.call(message, 'latestVcsWkid')
        )
          writer
            .uint32(/* id 4, wireType 0 =*/ 32)
            .uint32(message.latestVcsWkid);
        if (message.wkt != null && Object.hasOwnProperty.call(message, 'wkt'))
          writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.wkt);
        return writer;
      };

      /**
       * Encodes the specified SpatialReference message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.SpatialReference.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference} message SpatialReference message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      SpatialReference.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a SpatialReference message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.SpatialReference} SpatialReference
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SpatialReference.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.wkid = reader.uint32();
              break;
            }
            case 2: {
              message.lastestWkid = reader.uint32();
              break;
            }
            case 3: {
              message.vcsWkid = reader.uint32();
              break;
            }
            case 4: {
              message.latestVcsWkid = reader.uint32();
              break;
            }
            case 5: {
              message.wkt = reader.string();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a SpatialReference message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.SpatialReference} SpatialReference
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SpatialReference.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a SpatialReference message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      SpatialReference.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.wkid != null && message.hasOwnProperty('wkid'))
          if (!$util.isInteger(message.wkid)) return 'wkid: integer expected';
        if (
          message.lastestWkid != null &&
          message.hasOwnProperty('lastestWkid')
        )
          if (!$util.isInteger(message.lastestWkid))
            return 'lastestWkid: integer expected';
        if (message.vcsWkid != null && message.hasOwnProperty('vcsWkid'))
          if (!$util.isInteger(message.vcsWkid))
            return 'vcsWkid: integer expected';
        if (
          message.latestVcsWkid != null &&
          message.hasOwnProperty('latestVcsWkid')
        )
          if (!$util.isInteger(message.latestVcsWkid))
            return 'latestVcsWkid: integer expected';
        if (message.wkt != null && message.hasOwnProperty('wkt'))
          if (!$util.isString(message.wkt)) return 'wkt: string expected';
        return null;
      };

      /**
       * Creates a SpatialReference message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.SpatialReference} SpatialReference
       */
      SpatialReference.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference();
        if (object.wkid != null) message.wkid = object.wkid >>> 0;
        if (object.lastestWkid != null)
          message.lastestWkid = object.lastestWkid >>> 0;
        if (object.vcsWkid != null) message.vcsWkid = object.vcsWkid >>> 0;
        if (object.latestVcsWkid != null)
          message.latestVcsWkid = object.latestVcsWkid >>> 0;
        if (object.wkt != null) message.wkt = String(object.wkt);
        return message;
      };

      /**
       * Creates a plain object from a SpatialReference message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.SpatialReference} message SpatialReference
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      SpatialReference.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.wkid = 0;
          object.lastestWkid = 0;
          object.vcsWkid = 0;
          object.latestVcsWkid = 0;
          object.wkt = '';
        }
        if (message.wkid != null && message.hasOwnProperty('wkid'))
          object.wkid = message.wkid;
        if (
          message.lastestWkid != null &&
          message.hasOwnProperty('lastestWkid')
        )
          object.lastestWkid = message.lastestWkid;
        if (message.vcsWkid != null && message.hasOwnProperty('vcsWkid'))
          object.vcsWkid = message.vcsWkid;
        if (
          message.latestVcsWkid != null &&
          message.hasOwnProperty('latestVcsWkid')
        )
          object.latestVcsWkid = message.latestVcsWkid;
        if (message.wkt != null && message.hasOwnProperty('wkt'))
          object.wkt = message.wkt;
        return object;
      };

      /**
       * Converts this SpatialReference to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      SpatialReference.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for SpatialReference
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      SpatialReference.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix +
          '/esriPBuffer.FeatureCollectionPBuffer.SpatialReference'
        );
      };

      return SpatialReference;
    })();

    FeatureCollectionPBuffer.Field = (function () {
      /**
       * Properties of a Field.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IField
       * @property {string|null} [name] Field name
       * @property {esriPBuffer.FeatureCollectionPBuffer.FieldType|null} [fieldType] Field fieldType
       * @property {string|null} [alias] Field alias
       * @property {esriPBuffer.FeatureCollectionPBuffer.SQLType|null} [sqlType] Field sqlType
       * @property {string|null} [domain] Field domain
       * @property {string|null} [defaultValue] Field defaultValue
       */

      /**
       * Constructs a new Field.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Field.
       * @implements IField
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IField=} [properties] Properties to set
       */
      function Field(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Field name.
       * @member {string} name
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.name = '';

      /**
       * Field fieldType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.FieldType} fieldType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.fieldType = 0;

      /**
       * Field alias.
       * @member {string} alias
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.alias = '';

      /**
       * Field sqlType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.SQLType} sqlType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.sqlType = 0;

      /**
       * Field domain.
       * @member {string} domain
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.domain = '';

      /**
       * Field defaultValue.
       * @member {string} defaultValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.defaultValue = '';

      /**
       * Creates a new Field instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IField=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Field} Field instance
       */
      Field.create = function create(properties) {
        return new Field(properties);
      };

      /**
       * Encodes the specified Field message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Field.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IField} message Field message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Field.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, 'name'))
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.name);
        if (
          message.fieldType != null &&
          Object.hasOwnProperty.call(message, 'fieldType')
        )
          writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.fieldType);
        if (
          message.alias != null &&
          Object.hasOwnProperty.call(message, 'alias')
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.alias);
        if (
          message.sqlType != null &&
          Object.hasOwnProperty.call(message, 'sqlType')
        )
          writer.uint32(/* id 4, wireType 0 =*/ 32).int32(message.sqlType);
        if (
          message.domain != null &&
          Object.hasOwnProperty.call(message, 'domain')
        )
          writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.domain);
        if (
          message.defaultValue != null &&
          Object.hasOwnProperty.call(message, 'defaultValue')
        )
          writer
            .uint32(/* id 6, wireType 2 =*/ 50)
            .string(message.defaultValue);
        return writer;
      };

      /**
       * Encodes the specified Field message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Field.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IField} message Field message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Field.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Field message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Field} Field
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Field.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Field();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.name = reader.string();
              break;
            }
            case 2: {
              message.fieldType = reader.int32();
              break;
            }
            case 3: {
              message.alias = reader.string();
              break;
            }
            case 4: {
              message.sqlType = reader.int32();
              break;
            }
            case 5: {
              message.domain = reader.string();
              break;
            }
            case 6: {
              message.defaultValue = reader.string();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Field message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Field} Field
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Field.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Field message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Field.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.name != null && message.hasOwnProperty('name'))
          if (!$util.isString(message.name)) return 'name: string expected';
        if (message.fieldType != null && message.hasOwnProperty('fieldType'))
          switch (message.fieldType) {
            default:
              return 'fieldType: enum value expected';
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
        if (message.alias != null && message.hasOwnProperty('alias'))
          if (!$util.isString(message.alias)) return 'alias: string expected';
        if (message.sqlType != null && message.hasOwnProperty('sqlType'))
          switch (message.sqlType) {
            default:
              return 'sqlType: enum value expected';
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
        if (message.domain != null && message.hasOwnProperty('domain'))
          if (!$util.isString(message.domain)) return 'domain: string expected';
        if (
          message.defaultValue != null &&
          message.hasOwnProperty('defaultValue')
        )
          if (!$util.isString(message.defaultValue))
            return 'defaultValue: string expected';
        return null;
      };

      /**
       * Creates a Field message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Field} Field
       */
      Field.fromObject = function fromObject(object) {
        if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Field)
          return object;
        var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Field();
        if (object.name != null) message.name = String(object.name);
        switch (object.fieldType) {
          default:
            if (typeof object.fieldType === 'number') {
              message.fieldType = object.fieldType;
              break;
            }
            break;
          case 'esriFieldTypeSmallInteger':
          case 0:
            message.fieldType = 0;
            break;
          case 'esriFieldTypeInteger':
          case 1:
            message.fieldType = 1;
            break;
          case 'esriFieldTypeSingle':
          case 2:
            message.fieldType = 2;
            break;
          case 'esriFieldTypeDouble':
          case 3:
            message.fieldType = 3;
            break;
          case 'esriFieldTypeString':
          case 4:
            message.fieldType = 4;
            break;
          case 'esriFieldTypeDate':
          case 5:
            message.fieldType = 5;
            break;
          case 'esriFieldTypeOID':
          case 6:
            message.fieldType = 6;
            break;
          case 'esriFieldTypeGeometry':
          case 7:
            message.fieldType = 7;
            break;
          case 'esriFieldTypeBlob':
          case 8:
            message.fieldType = 8;
            break;
          case 'esriFieldTypeRaster':
          case 9:
            message.fieldType = 9;
            break;
          case 'esriFieldTypeGUID':
          case 10:
            message.fieldType = 10;
            break;
          case 'esriFieldTypeGlobalID':
          case 11:
            message.fieldType = 11;
            break;
          case 'esriFieldTypeXML':
          case 12:
            message.fieldType = 12;
            break;
          case 'esriFieldTypeBigInteger':
          case 13:
            message.fieldType = 13;
            break;
          case 'esriFieldTypeDateOnly':
          case 14:
            message.fieldType = 14;
            break;
          case 'esriFieldTypeTimeOnly':
          case 15:
            message.fieldType = 15;
            break;
          case 'esriFieldTypeTimestampOffset':
          case 16:
            message.fieldType = 16;
            break;
        }
        if (object.alias != null) message.alias = String(object.alias);
        switch (object.sqlType) {
          default:
            if (typeof object.sqlType === 'number') {
              message.sqlType = object.sqlType;
              break;
            }
            break;
          case 'sqlTypeBigInt':
          case 0:
            message.sqlType = 0;
            break;
          case 'sqlTypeBinary':
          case 1:
            message.sqlType = 1;
            break;
          case 'sqlTypeBit':
          case 2:
            message.sqlType = 2;
            break;
          case 'sqlTypeChar':
          case 3:
            message.sqlType = 3;
            break;
          case 'sqlTypeDate':
          case 4:
            message.sqlType = 4;
            break;
          case 'sqlTypeDecimal':
          case 5:
            message.sqlType = 5;
            break;
          case 'sqlTypeDouble':
          case 6:
            message.sqlType = 6;
            break;
          case 'sqlTypeFloat':
          case 7:
            message.sqlType = 7;
            break;
          case 'sqlTypeGeometry':
          case 8:
            message.sqlType = 8;
            break;
          case 'sqlTypeGUID':
          case 9:
            message.sqlType = 9;
            break;
          case 'sqlTypeInteger':
          case 10:
            message.sqlType = 10;
            break;
          case 'sqlTypeLongNVarchar':
          case 11:
            message.sqlType = 11;
            break;
          case 'sqlTypeLongVarbinary':
          case 12:
            message.sqlType = 12;
            break;
          case 'sqlTypeLongVarchar':
          case 13:
            message.sqlType = 13;
            break;
          case 'sqlTypeNChar':
          case 14:
            message.sqlType = 14;
            break;
          case 'sqlTypeNVarchar':
          case 15:
            message.sqlType = 15;
            break;
          case 'sqlTypeOther':
          case 16:
            message.sqlType = 16;
            break;
          case 'sqlTypeReal':
          case 17:
            message.sqlType = 17;
            break;
          case 'sqlTypeSmallInt':
          case 18:
            message.sqlType = 18;
            break;
          case 'sqlTypeSqlXml':
          case 19:
            message.sqlType = 19;
            break;
          case 'sqlTypeTime':
          case 20:
            message.sqlType = 20;
            break;
          case 'sqlTypeTimestamp':
          case 21:
            message.sqlType = 21;
            break;
          case 'sqlTypeTimestamp2':
          case 22:
            message.sqlType = 22;
            break;
          case 'sqlTypeTinyInt':
          case 23:
            message.sqlType = 23;
            break;
          case 'sqlTypeVarbinary':
          case 24:
            message.sqlType = 24;
            break;
          case 'sqlTypeVarchar':
          case 25:
            message.sqlType = 25;
            break;
          case 'sqlTypeTimestampWithTimezone':
          case 26:
            message.sqlType = 26;
            break;
        }
        if (object.domain != null) message.domain = String(object.domain);
        if (object.defaultValue != null)
          message.defaultValue = String(object.defaultValue);
        return message;
      };

      /**
       * Creates a plain object from a Field message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Field} message Field
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Field.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.name = '';
          object.fieldType =
            options.enums === String ? 'esriFieldTypeSmallInteger' : 0;
          object.alias = '';
          object.sqlType = options.enums === String ? 'sqlTypeBigInt' : 0;
          object.domain = '';
          object.defaultValue = '';
        }
        if (message.name != null && message.hasOwnProperty('name'))
          object.name = message.name;
        if (message.fieldType != null && message.hasOwnProperty('fieldType'))
          object.fieldType =
            options.enums === String
              ? $root.esriPBuffer.FeatureCollectionPBuffer.FieldType[
                  message.fieldType
                ] === undefined
                ? message.fieldType
                : $root.esriPBuffer.FeatureCollectionPBuffer.FieldType[
                    message.fieldType
                  ]
              : message.fieldType;
        if (message.alias != null && message.hasOwnProperty('alias'))
          object.alias = message.alias;
        if (message.sqlType != null && message.hasOwnProperty('sqlType'))
          object.sqlType =
            options.enums === String
              ? $root.esriPBuffer.FeatureCollectionPBuffer.SQLType[
                  message.sqlType
                ] === undefined
                ? message.sqlType
                : $root.esriPBuffer.FeatureCollectionPBuffer.SQLType[
                    message.sqlType
                  ]
              : message.sqlType;
        if (message.domain != null && message.hasOwnProperty('domain'))
          object.domain = message.domain;
        if (
          message.defaultValue != null &&
          message.hasOwnProperty('defaultValue')
        )
          object.defaultValue = message.defaultValue;
        return object;
      };

      /**
       * Converts this Field to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Field.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Field
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Field.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Field';
      };

      return Field;
    })();

    FeatureCollectionPBuffer.GeometryField = (function () {
      /**
       * Properties of a GeometryField.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IGeometryField
       * @property {esriPBuffer.FeatureCollectionPBuffer.IField|null} [field] GeometryField field
       * @property {esriPBuffer.FeatureCollectionPBuffer.GeometryType|null} [geometryType] GeometryField geometryType
       */

      /**
       * Constructs a new GeometryField.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a GeometryField.
       * @implements IGeometryField
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryField=} [properties] Properties to set
       */
      function GeometryField(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * GeometryField field.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IField|null|undefined} field
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @instance
       */
      GeometryField.prototype.field = null;

      /**
       * GeometryField geometryType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.GeometryType} geometryType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @instance
       */
      GeometryField.prototype.geometryType = 0;

      /**
       * Creates a new GeometryField instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryField=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryField} GeometryField instance
       */
      GeometryField.create = function create(properties) {
        return new GeometryField(properties);
      };

      /**
       * Encodes the specified GeometryField message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.GeometryField.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryField} message GeometryField message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      GeometryField.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.field != null &&
          Object.hasOwnProperty.call(message, 'field')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Field.encode(
            message.field,
            writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
          ).ldelim();
        if (
          message.geometryType != null &&
          Object.hasOwnProperty.call(message, 'geometryType')
        )
          writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.geometryType);
        return writer;
      };

      /**
       * Encodes the specified GeometryField message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.GeometryField.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryField} message GeometryField message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      GeometryField.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a GeometryField message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryField} GeometryField
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      GeometryField.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.field =
                $root.esriPBuffer.FeatureCollectionPBuffer.Field.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 2: {
              message.geometryType = reader.int32();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a GeometryField message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryField} GeometryField
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      GeometryField.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a GeometryField message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      GeometryField.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.field != null && message.hasOwnProperty('field')) {
          var error = $root.esriPBuffer.FeatureCollectionPBuffer.Field.verify(
            message.field,
          );
          if (error) return 'field.' + error;
        }
        if (
          message.geometryType != null &&
          message.hasOwnProperty('geometryType')
        )
          switch (message.geometryType) {
            default:
              return 'geometryType: enum value expected';
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

      /**
       * Creates a GeometryField message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryField} GeometryField
       */
      GeometryField.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField();
        if (object.field != null) {
          if (typeof object.field !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.GeometryField.field: object expected',
            );
          message.field =
            $root.esriPBuffer.FeatureCollectionPBuffer.Field.fromObject(
              object.field,
            );
        }
        switch (object.geometryType) {
          default:
            if (typeof object.geometryType === 'number') {
              message.geometryType = object.geometryType;
              break;
            }
            break;
          case 'esriGeometryTypePoint':
          case 0:
            message.geometryType = 0;
            break;
          case 'esriGeometryTypeMultipoint':
          case 1:
            message.geometryType = 1;
            break;
          case 'esriGeometryTypePolyline':
          case 2:
            message.geometryType = 2;
            break;
          case 'esriGeometryTypePolygon':
          case 3:
            message.geometryType = 3;
            break;
          case 'esriGeometryTypeMultipatch':
          case 4:
            message.geometryType = 4;
            break;
          case 'esriGeometryTypeNone':
          case 127:
            message.geometryType = 127;
            break;
          case 'esriGeometryTypeEnvelope':
          case 5:
            message.geometryType = 5;
            break;
        }
        return message;
      };

      /**
       * Creates a plain object from a GeometryField message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.GeometryField} message GeometryField
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      GeometryField.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.field = null;
          object.geometryType =
            options.enums === String ? 'esriGeometryTypePoint' : 0;
        }
        if (message.field != null && message.hasOwnProperty('field'))
          object.field =
            $root.esriPBuffer.FeatureCollectionPBuffer.Field.toObject(
              message.field,
              options,
            );
        if (
          message.geometryType != null &&
          message.hasOwnProperty('geometryType')
        )
          object.geometryType =
            options.enums === String
              ? $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[
                  message.geometryType
                ] === undefined
                ? message.geometryType
                : $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[
                    message.geometryType
                  ]
              : message.geometryType;
        return object;
      };

      /**
       * Converts this GeometryField to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      GeometryField.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for GeometryField
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryField
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      GeometryField.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.GeometryField'
        );
      };

      return GeometryField;
    })();

    FeatureCollectionPBuffer.Envelope = (function () {
      /**
       * Properties of an Envelope.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IEnvelope
       * @property {number|null} [XMin] Envelope XMin
       * @property {number|null} [YMin] Envelope YMin
       * @property {number|null} [XMax] Envelope XMax
       * @property {number|null} [YMax] Envelope YMax
       * @property {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference|null} [SpatialReference] Envelope SpatialReference
       */

      /**
       * Constructs a new Envelope.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents an Envelope.
       * @implements IEnvelope
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IEnvelope=} [properties] Properties to set
       */
      function Envelope(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Envelope XMin.
       * @member {number} XMin
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @instance
       */
      Envelope.prototype.XMin = 0;

      /**
       * Envelope YMin.
       * @member {number} YMin
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @instance
       */
      Envelope.prototype.YMin = 0;

      /**
       * Envelope XMax.
       * @member {number} XMax
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @instance
       */
      Envelope.prototype.XMax = 0;

      /**
       * Envelope YMax.
       * @member {number} YMax
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @instance
       */
      Envelope.prototype.YMax = 0;

      /**
       * Envelope SpatialReference.
       * @member {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference|null|undefined} SpatialReference
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @instance
       */
      Envelope.prototype.SpatialReference = null;

      /**
       * Creates a new Envelope instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IEnvelope=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Envelope} Envelope instance
       */
      Envelope.create = function create(properties) {
        return new Envelope(properties);
      };

      /**
       * Encodes the specified Envelope message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Envelope.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IEnvelope} message Envelope message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Envelope.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.XMin != null && Object.hasOwnProperty.call(message, 'XMin'))
          writer.uint32(/* id 1, wireType 1 =*/ 9).double(message.XMin);
        if (message.YMin != null && Object.hasOwnProperty.call(message, 'YMin'))
          writer.uint32(/* id 2, wireType 1 =*/ 17).double(message.YMin);
        if (message.XMax != null && Object.hasOwnProperty.call(message, 'XMax'))
          writer.uint32(/* id 3, wireType 1 =*/ 25).double(message.XMax);
        if (message.YMax != null && Object.hasOwnProperty.call(message, 'YMax'))
          writer.uint32(/* id 4, wireType 1 =*/ 33).double(message.YMax);
        if (
          message.SpatialReference != null &&
          Object.hasOwnProperty.call(message, 'SpatialReference')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.encode(
            message.SpatialReference,
            writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          ).ldelim();
        return writer;
      };

      /**
       * Encodes the specified Envelope message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Envelope.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IEnvelope} message Envelope message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Envelope.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an Envelope message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Envelope} Envelope
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Envelope.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Envelope();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.XMin = reader.double();
              break;
            }
            case 2: {
              message.YMin = reader.double();
              break;
            }
            case 3: {
              message.XMax = reader.double();
              break;
            }
            case 4: {
              message.YMax = reader.double();
              break;
            }
            case 5: {
              message.SpatialReference =
                $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an Envelope message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Envelope} Envelope
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Envelope.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an Envelope message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Envelope.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.XMin != null && message.hasOwnProperty('XMin'))
          if (typeof message.XMin !== 'number') return 'XMin: number expected';
        if (message.YMin != null && message.hasOwnProperty('YMin'))
          if (typeof message.YMin !== 'number') return 'YMin: number expected';
        if (message.XMax != null && message.hasOwnProperty('XMax'))
          if (typeof message.XMax !== 'number') return 'XMax: number expected';
        if (message.YMax != null && message.hasOwnProperty('YMax'))
          if (typeof message.YMax !== 'number') return 'YMax: number expected';
        if (
          message.SpatialReference != null &&
          message.hasOwnProperty('SpatialReference')
        ) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.verify(
              message.SpatialReference,
            );
          if (error) return 'SpatialReference.' + error;
        }
        return null;
      };

      /**
       * Creates an Envelope message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Envelope} Envelope
       */
      Envelope.fromObject = function fromObject(object) {
        if (
          object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Envelope
        )
          return object;
        var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Envelope();
        if (object.XMin != null) message.XMin = Number(object.XMin);
        if (object.YMin != null) message.YMin = Number(object.YMin);
        if (object.XMax != null) message.XMax = Number(object.XMax);
        if (object.YMax != null) message.YMax = Number(object.YMax);
        if (object.SpatialReference != null) {
          if (typeof object.SpatialReference !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Envelope.SpatialReference: object expected',
            );
          message.SpatialReference =
            $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.fromObject(
              object.SpatialReference,
            );
        }
        return message;
      };

      /**
       * Creates a plain object from an Envelope message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Envelope} message Envelope
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Envelope.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.XMin = 0;
          object.YMin = 0;
          object.XMax = 0;
          object.YMax = 0;
          object.SpatialReference = null;
        }
        if (message.XMin != null && message.hasOwnProperty('XMin'))
          object.XMin =
            options.json && !isFinite(message.XMin)
              ? String(message.XMin)
              : message.XMin;
        if (message.YMin != null && message.hasOwnProperty('YMin'))
          object.YMin =
            options.json && !isFinite(message.YMin)
              ? String(message.YMin)
              : message.YMin;
        if (message.XMax != null && message.hasOwnProperty('XMax'))
          object.XMax =
            options.json && !isFinite(message.XMax)
              ? String(message.XMax)
              : message.XMax;
        if (message.YMax != null && message.hasOwnProperty('YMax'))
          object.YMax =
            options.json && !isFinite(message.YMax)
              ? String(message.YMax)
              : message.YMax;
        if (
          message.SpatialReference != null &&
          message.hasOwnProperty('SpatialReference')
        )
          object.SpatialReference =
            $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.toObject(
              message.SpatialReference,
              options,
            );
        return object;
      };

      /**
       * Converts this Envelope to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Envelope.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Envelope
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Envelope
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Envelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Envelope';
      };

      return Envelope;
    })();

    FeatureCollectionPBuffer.Value = (function () {
      /**
       * Properties of a Value.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IValue
       * @property {string|null} [stringValue] Value stringValue
       * @property {number|null} [floatValue] Value floatValue
       * @property {number|null} [doubleValue] Value doubleValue
       * @property {number|null} [sintValue] Value sintValue
       * @property {number|null} [uintValue] Value uintValue
       * @property {number|Long|null} [int64Value] Value int64Value
       * @property {number|Long|null} [uint64Value] Value uint64Value
       * @property {number|Long|null} [sint64Value] Value sint64Value
       * @property {boolean|null} [boolValue] Value boolValue
       */

      /**
       * Constructs a new Value.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Value.
       * @implements IValue
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IValue=} [properties] Properties to set
       */
      function Value(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Value stringValue.
       * @member {string|null|undefined} stringValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.stringValue = null;

      /**
       * Value floatValue.
       * @member {number|null|undefined} floatValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.floatValue = null;

      /**
       * Value doubleValue.
       * @member {number|null|undefined} doubleValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.doubleValue = null;

      /**
       * Value sintValue.
       * @member {number|null|undefined} sintValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.sintValue = null;

      /**
       * Value uintValue.
       * @member {number|null|undefined} uintValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.uintValue = null;

      /**
       * Value int64Value.
       * @member {number|Long|null|undefined} int64Value
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.int64Value = null;

      /**
       * Value uint64Value.
       * @member {number|Long|null|undefined} uint64Value
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.uint64Value = null;

      /**
       * Value sint64Value.
       * @member {number|Long|null|undefined} sint64Value
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.sint64Value = null;

      /**
       * Value boolValue.
       * @member {boolean|null|undefined} boolValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.boolValue = null;

      // OneOf field names bound to virtual getters and setters
      var $oneOfFields;

      /**
       * Value valueType.
       * @member {"stringValue"|"floatValue"|"doubleValue"|"sintValue"|"uintValue"|"int64Value"|"uint64Value"|"sint64Value"|"boolValue"|undefined} valueType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Object.defineProperty(Value.prototype, 'valueType', {
        get: $util.oneOfGetter(
          ($oneOfFields = [
            'stringValue',
            'floatValue',
            'doubleValue',
            'sintValue',
            'uintValue',
            'int64Value',
            'uint64Value',
            'sint64Value',
            'boolValue',
          ]),
        ),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * Creates a new Value instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IValue=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Value} Value instance
       */
      Value.create = function create(properties) {
        return new Value(properties);
      };

      /**
       * Encodes the specified Value message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Value.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IValue} message Value message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Value.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.stringValue != null &&
          Object.hasOwnProperty.call(message, 'stringValue')
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.stringValue);
        if (
          message.floatValue != null &&
          Object.hasOwnProperty.call(message, 'floatValue')
        )
          writer.uint32(/* id 2, wireType 5 =*/ 21).float(message.floatValue);
        if (
          message.doubleValue != null &&
          Object.hasOwnProperty.call(message, 'doubleValue')
        )
          writer.uint32(/* id 3, wireType 1 =*/ 25).double(message.doubleValue);
        if (
          message.sintValue != null &&
          Object.hasOwnProperty.call(message, 'sintValue')
        )
          writer.uint32(/* id 4, wireType 0 =*/ 32).sint32(message.sintValue);
        if (
          message.uintValue != null &&
          Object.hasOwnProperty.call(message, 'uintValue')
        )
          writer.uint32(/* id 5, wireType 0 =*/ 40).uint32(message.uintValue);
        if (
          message.int64Value != null &&
          Object.hasOwnProperty.call(message, 'int64Value')
        )
          writer.uint32(/* id 6, wireType 0 =*/ 48).int64(message.int64Value);
        if (
          message.uint64Value != null &&
          Object.hasOwnProperty.call(message, 'uint64Value')
        )
          writer.uint32(/* id 7, wireType 0 =*/ 56).uint64(message.uint64Value);
        if (
          message.sint64Value != null &&
          Object.hasOwnProperty.call(message, 'sint64Value')
        )
          writer.uint32(/* id 8, wireType 0 =*/ 64).sint64(message.sint64Value);
        if (
          message.boolValue != null &&
          Object.hasOwnProperty.call(message, 'boolValue')
        )
          writer.uint32(/* id 9, wireType 0 =*/ 72).bool(message.boolValue);
        return writer;
      };

      /**
       * Encodes the specified Value message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Value.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IValue} message Value message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Value.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Value message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Value} Value
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Value.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Value();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.stringValue = reader.string();
              break;
            }
            case 2: {
              message.floatValue = reader.float();
              break;
            }
            case 3: {
              message.doubleValue = reader.double();
              break;
            }
            case 4: {
              message.sintValue = reader.sint32();
              break;
            }
            case 5: {
              message.uintValue = reader.uint32();
              break;
            }
            case 6: {
              message.int64Value = reader.int64();
              break;
            }
            case 7: {
              message.uint64Value = reader.uint64();
              break;
            }
            case 8: {
              message.sint64Value = reader.sint64();
              break;
            }
            case 9: {
              message.boolValue = reader.bool();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Value message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Value} Value
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Value.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Value message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Value.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        var properties = {};
        if (
          message.stringValue != null &&
          message.hasOwnProperty('stringValue')
        ) {
          properties.valueType = 1;
          if (!$util.isString(message.stringValue))
            return 'stringValue: string expected';
        }
        if (
          message.floatValue != null &&
          message.hasOwnProperty('floatValue')
        ) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (typeof message.floatValue !== 'number')
            return 'floatValue: number expected';
        }
        if (
          message.doubleValue != null &&
          message.hasOwnProperty('doubleValue')
        ) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (typeof message.doubleValue !== 'number')
            return 'doubleValue: number expected';
        }
        if (message.sintValue != null && message.hasOwnProperty('sintValue')) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (!$util.isInteger(message.sintValue))
            return 'sintValue: integer expected';
        }
        if (message.uintValue != null && message.hasOwnProperty('uintValue')) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (!$util.isInteger(message.uintValue))
            return 'uintValue: integer expected';
        }
        if (
          message.int64Value != null &&
          message.hasOwnProperty('int64Value')
        ) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (
            !$util.isInteger(message.int64Value) &&
            !(
              message.int64Value &&
              $util.isInteger(message.int64Value.low) &&
              $util.isInteger(message.int64Value.high)
            )
          )
            return 'int64Value: integer|Long expected';
        }
        if (
          message.uint64Value != null &&
          message.hasOwnProperty('uint64Value')
        ) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (
            !$util.isInteger(message.uint64Value) &&
            !(
              message.uint64Value &&
              $util.isInteger(message.uint64Value.low) &&
              $util.isInteger(message.uint64Value.high)
            )
          )
            return 'uint64Value: integer|Long expected';
        }
        if (
          message.sint64Value != null &&
          message.hasOwnProperty('sint64Value')
        ) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (
            !$util.isInteger(message.sint64Value) &&
            !(
              message.sint64Value &&
              $util.isInteger(message.sint64Value.low) &&
              $util.isInteger(message.sint64Value.high)
            )
          )
            return 'sint64Value: integer|Long expected';
        }
        if (message.boolValue != null && message.hasOwnProperty('boolValue')) {
          if (properties.valueType === 1) return 'valueType: multiple values';
          properties.valueType = 1;
          if (typeof message.boolValue !== 'boolean')
            return 'boolValue: boolean expected';
        }
        return null;
      };

      /**
       * Creates a Value message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Value} Value
       */
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
        if (object.sintValue != null) message.sintValue = object.sintValue | 0;
        if (object.uintValue != null)
          message.uintValue = object.uintValue >>> 0;
        if (object.int64Value != null)
          if ($util.Long)
            (message.int64Value = $util.Long.fromValue(
              object.int64Value,
            )).unsigned = false;
          else if (typeof object.int64Value === 'string')
            message.int64Value = parseInt(object.int64Value, 10);
          else if (typeof object.int64Value === 'number')
            message.int64Value = object.int64Value;
          else if (typeof object.int64Value === 'object')
            message.int64Value = new $util.LongBits(
              object.int64Value.low >>> 0,
              object.int64Value.high >>> 0,
            ).toNumber();
        if (object.uint64Value != null)
          if ($util.Long)
            (message.uint64Value = $util.Long.fromValue(
              object.uint64Value,
            )).unsigned = true;
          else if (typeof object.uint64Value === 'string')
            message.uint64Value = parseInt(object.uint64Value, 10);
          else if (typeof object.uint64Value === 'number')
            message.uint64Value = object.uint64Value;
          else if (typeof object.uint64Value === 'object')
            message.uint64Value = new $util.LongBits(
              object.uint64Value.low >>> 0,
              object.uint64Value.high >>> 0,
            ).toNumber(true);
        if (object.sint64Value != null)
          if ($util.Long)
            (message.sint64Value = $util.Long.fromValue(
              object.sint64Value,
            )).unsigned = false;
          else if (typeof object.sint64Value === 'string')
            message.sint64Value = parseInt(object.sint64Value, 10);
          else if (typeof object.sint64Value === 'number')
            message.sint64Value = object.sint64Value;
          else if (typeof object.sint64Value === 'object')
            message.sint64Value = new $util.LongBits(
              object.sint64Value.low >>> 0,
              object.sint64Value.high >>> 0,
            ).toNumber();
        if (object.boolValue != null)
          message.boolValue = Boolean(object.boolValue);
        return message;
      };

      /**
       * Creates a plain object from a Value message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Value} message Value
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Value.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (
          message.stringValue != null &&
          message.hasOwnProperty('stringValue')
        ) {
          object.stringValue = message.stringValue;
          if (options.oneofs) object.valueType = 'stringValue';
        }
        if (
          message.floatValue != null &&
          message.hasOwnProperty('floatValue')
        ) {
          object.floatValue =
            options.json && !isFinite(message.floatValue)
              ? String(message.floatValue)
              : message.floatValue;
          if (options.oneofs) object.valueType = 'floatValue';
        }
        if (
          message.doubleValue != null &&
          message.hasOwnProperty('doubleValue')
        ) {
          object.doubleValue =
            options.json && !isFinite(message.doubleValue)
              ? String(message.doubleValue)
              : message.doubleValue;
          if (options.oneofs) object.valueType = 'doubleValue';
        }
        if (message.sintValue != null && message.hasOwnProperty('sintValue')) {
          object.sintValue = message.sintValue;
          if (options.oneofs) object.valueType = 'sintValue';
        }
        if (message.uintValue != null && message.hasOwnProperty('uintValue')) {
          object.uintValue = message.uintValue;
          if (options.oneofs) object.valueType = 'uintValue';
        }
        if (
          message.int64Value != null &&
          message.hasOwnProperty('int64Value')
        ) {
          if (typeof message.int64Value === 'number')
            object.int64Value =
              options.longs === String
                ? String(message.int64Value)
                : message.int64Value;
          else
            object.int64Value =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.int64Value)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.int64Value.low >>> 0,
                      message.int64Value.high >>> 0,
                    ).toNumber()
                  : message.int64Value;
          if (options.oneofs) object.valueType = 'int64Value';
        }
        if (
          message.uint64Value != null &&
          message.hasOwnProperty('uint64Value')
        ) {
          if (typeof message.uint64Value === 'number')
            object.uint64Value =
              options.longs === String
                ? String(message.uint64Value)
                : message.uint64Value;
          else
            object.uint64Value =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.uint64Value)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.uint64Value.low >>> 0,
                      message.uint64Value.high >>> 0,
                    ).toNumber(true)
                  : message.uint64Value;
          if (options.oneofs) object.valueType = 'uint64Value';
        }
        if (
          message.sint64Value != null &&
          message.hasOwnProperty('sint64Value')
        ) {
          if (typeof message.sint64Value === 'number')
            object.sint64Value =
              options.longs === String
                ? String(message.sint64Value)
                : message.sint64Value;
          else
            object.sint64Value =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.sint64Value)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.sint64Value.low >>> 0,
                      message.sint64Value.high >>> 0,
                    ).toNumber()
                  : message.sint64Value;
          if (options.oneofs) object.valueType = 'sint64Value';
        }
        if (message.boolValue != null && message.hasOwnProperty('boolValue')) {
          object.boolValue = message.boolValue;
          if (options.oneofs) object.valueType = 'boolValue';
        }
        return object;
      };

      /**
       * Converts this Value to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Value.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Value
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Value.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Value';
      };

      return Value;
    })();

    FeatureCollectionPBuffer.Geometry = (function () {
      /**
       * Properties of a Geometry.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IGeometry
       * @property {esriPBuffer.FeatureCollectionPBuffer.GeometryType|null} [geometryType] Geometry geometryType
       * @property {Array.<number>|null} [lengths] Geometry lengths
       * @property {Array.<number|Long>|null} [coords] Geometry coords
       */

      /**
       * Constructs a new Geometry.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Geometry.
       * @implements IGeometry
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometry=} [properties] Properties to set
       */
      function Geometry(properties) {
        this.lengths = [];
        this.coords = [];
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Geometry geometryType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.GeometryType} geometryType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @instance
       */
      Geometry.prototype.geometryType = 0;

      /**
       * Geometry lengths.
       * @member {Array.<number>} lengths
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @instance
       */
      Geometry.prototype.lengths = $util.emptyArray;

      /**
       * Geometry coords.
       * @member {Array.<number|Long>} coords
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @instance
       */
      Geometry.prototype.coords = $util.emptyArray;

      /**
       * Creates a new Geometry instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometry=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Geometry} Geometry instance
       */
      Geometry.create = function create(properties) {
        return new Geometry(properties);
      };

      /**
       * Encodes the specified Geometry message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Geometry.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometry} message Geometry message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Geometry.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.geometryType != null &&
          Object.hasOwnProperty.call(message, 'geometryType')
        )
          writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.geometryType);
        if (message.lengths != null && message.lengths.length) {
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork();
          for (var i = 0; i < message.lengths.length; ++i)
            writer.uint32(message.lengths[i]);
          writer.ldelim();
        }
        if (message.coords != null && message.coords.length) {
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork();
          for (var i = 0; i < message.coords.length; ++i)
            writer.sint64(message.coords[i]);
          writer.ldelim();
        }
        return writer;
      };

      /**
       * Encodes the specified Geometry message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Geometry.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometry} message Geometry message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Geometry.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Geometry message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Geometry} Geometry
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Geometry.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Geometry();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.geometryType = reader.int32();
              break;
            }
            case 2: {
              if (!(message.lengths && message.lengths.length))
                message.lengths = [];
              if ((tag & 7) === 2) {
                var end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2) message.lengths.push(reader.uint32());
              } else message.lengths.push(reader.uint32());
              break;
            }
            case 3: {
              if (!(message.coords && message.coords.length))
                message.coords = [];
              if ((tag & 7) === 2) {
                var end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2) message.coords.push(reader.sint64());
              } else message.coords.push(reader.sint64());
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Geometry message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Geometry} Geometry
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Geometry.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Geometry message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Geometry.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (
          message.geometryType != null &&
          message.hasOwnProperty('geometryType')
        )
          switch (message.geometryType) {
            default:
              return 'geometryType: enum value expected';
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 127:
            case 5:
              break;
          }
        if (message.lengths != null && message.hasOwnProperty('lengths')) {
          if (!Array.isArray(message.lengths)) return 'lengths: array expected';
          for (var i = 0; i < message.lengths.length; ++i)
            if (!$util.isInteger(message.lengths[i]))
              return 'lengths: integer[] expected';
        }
        if (message.coords != null && message.hasOwnProperty('coords')) {
          if (!Array.isArray(message.coords)) return 'coords: array expected';
          for (var i = 0; i < message.coords.length; ++i)
            if (
              !$util.isInteger(message.coords[i]) &&
              !(
                message.coords[i] &&
                $util.isInteger(message.coords[i].low) &&
                $util.isInteger(message.coords[i].high)
              )
            )
              return 'coords: integer|Long[] expected';
        }
        return null;
      };

      /**
       * Creates a Geometry message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Geometry} Geometry
       */
      Geometry.fromObject = function fromObject(object) {
        if (
          object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Geometry
        )
          return object;
        var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Geometry();
        switch (object.geometryType) {
          default:
            if (typeof object.geometryType === 'number') {
              message.geometryType = object.geometryType;
              break;
            }
            break;
          case 'esriGeometryTypePoint':
          case 0:
            message.geometryType = 0;
            break;
          case 'esriGeometryTypeMultipoint':
          case 1:
            message.geometryType = 1;
            break;
          case 'esriGeometryTypePolyline':
          case 2:
            message.geometryType = 2;
            break;
          case 'esriGeometryTypePolygon':
          case 3:
            message.geometryType = 3;
            break;
          case 'esriGeometryTypeMultipatch':
          case 4:
            message.geometryType = 4;
            break;
          case 'esriGeometryTypeNone':
          case 127:
            message.geometryType = 127;
            break;
          case 'esriGeometryTypeEnvelope':
          case 5:
            message.geometryType = 5;
            break;
        }
        if (object.lengths) {
          if (!Array.isArray(object.lengths))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Geometry.lengths: array expected',
            );
          message.lengths = [];
          for (var i = 0; i < object.lengths.length; ++i)
            message.lengths[i] = object.lengths[i] >>> 0;
        }
        if (object.coords) {
          if (!Array.isArray(object.coords))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Geometry.coords: array expected',
            );
          message.coords = [];
          for (var i = 0; i < object.coords.length; ++i)
            if ($util.Long)
              (message.coords[i] = $util.Long.fromValue(
                object.coords[i],
              )).unsigned = false;
            else if (typeof object.coords[i] === 'string')
              message.coords[i] = parseInt(object.coords[i], 10);
            else if (typeof object.coords[i] === 'number')
              message.coords[i] = object.coords[i];
            else if (typeof object.coords[i] === 'object')
              message.coords[i] = new $util.LongBits(
                object.coords[i].low >>> 0,
                object.coords[i].high >>> 0,
              ).toNumber();
        }
        return message;
      };

      /**
       * Creates a plain object from a Geometry message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Geometry} message Geometry
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Geometry.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.arrays || options.defaults) {
          object.lengths = [];
          object.coords = [];
        }
        if (options.defaults)
          object.geometryType =
            options.enums === String ? 'esriGeometryTypePoint' : 0;
        if (
          message.geometryType != null &&
          message.hasOwnProperty('geometryType')
        )
          object.geometryType =
            options.enums === String
              ? $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[
                  message.geometryType
                ] === undefined
                ? message.geometryType
                : $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[
                    message.geometryType
                  ]
              : message.geometryType;
        if (message.lengths && message.lengths.length) {
          object.lengths = [];
          for (var j = 0; j < message.lengths.length; ++j)
            object.lengths[j] = message.lengths[j];
        }
        if (message.coords && message.coords.length) {
          object.coords = [];
          for (var j = 0; j < message.coords.length; ++j)
            if (typeof message.coords[j] === 'number')
              object.coords[j] =
                options.longs === String
                  ? String(message.coords[j])
                  : message.coords[j];
            else
              object.coords[j] =
                options.longs === String
                  ? $util.Long.prototype.toString.call(message.coords[j])
                  : options.longs === Number
                    ? new $util.LongBits(
                        message.coords[j].low >>> 0,
                        message.coords[j].high >>> 0,
                      ).toNumber()
                    : message.coords[j];
        }
        return object;
      };

      /**
       * Converts this Geometry to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Geometry.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Geometry
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Geometry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Geometry';
      };

      return Geometry;
    })();

    FeatureCollectionPBuffer.esriShapeBuffer = (function () {
      /**
       * Properties of an esriShapeBuffer.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IesriShapeBuffer
       * @property {Uint8Array|null} [bytes] esriShapeBuffer bytes
       */

      /**
       * Constructs a new esriShapeBuffer.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents an esriShapeBuffer.
       * @implements IesriShapeBuffer
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer=} [properties] Properties to set
       */
      function esriShapeBuffer(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * esriShapeBuffer bytes.
       * @member {Uint8Array} bytes
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @instance
       */
      esriShapeBuffer.prototype.bytes = $util.newBuffer([]);

      /**
       * Creates a new esriShapeBuffer instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer} esriShapeBuffer instance
       */
      esriShapeBuffer.create = function create(properties) {
        return new esriShapeBuffer(properties);
      };

      /**
       * Encodes the specified esriShapeBuffer message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer} message esriShapeBuffer message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      esriShapeBuffer.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.bytes != null &&
          Object.hasOwnProperty.call(message, 'bytes')
        )
          writer.uint32(/* id 1, wireType 2 =*/ 10).bytes(message.bytes);
        return writer;
      };

      /**
       * Encodes the specified esriShapeBuffer message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer} message esriShapeBuffer message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      esriShapeBuffer.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an esriShapeBuffer message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer} esriShapeBuffer
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      esriShapeBuffer.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.bytes = reader.bytes();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an esriShapeBuffer message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer} esriShapeBuffer
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      esriShapeBuffer.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an esriShapeBuffer message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      esriShapeBuffer.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.bytes != null && message.hasOwnProperty('bytes'))
          if (
            !(
              (message.bytes && typeof message.bytes.length === 'number') ||
              $util.isString(message.bytes)
            )
          )
            return 'bytes: buffer expected';
        return null;
      };

      /**
       * Creates an esriShapeBuffer message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer} esriShapeBuffer
       */
      esriShapeBuffer.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer();
        if (object.bytes != null)
          if (typeof object.bytes === 'string')
            $util.base64.decode(
              object.bytes,
              (message.bytes = $util.newBuffer(
                $util.base64.length(object.bytes),
              )),
              0,
            );
          else if (object.bytes.length >= 0) message.bytes = object.bytes;
        return message;
      };

      /**
       * Creates a plain object from an esriShapeBuffer message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer} message esriShapeBuffer
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      esriShapeBuffer.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults)
          if (options.bytes === String) object.bytes = '';
          else {
            object.bytes = [];
            if (options.bytes !== Array)
              object.bytes = $util.newBuffer(object.bytes);
          }
        if (message.bytes != null && message.hasOwnProperty('bytes'))
          object.bytes =
            options.bytes === String
              ? $util.base64.encode(message.bytes, 0, message.bytes.length)
              : options.bytes === Array
                ? Array.prototype.slice.call(message.bytes)
                : message.bytes;
        return object;
      };

      /**
       * Converts this esriShapeBuffer to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      esriShapeBuffer.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for esriShapeBuffer
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      esriShapeBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix +
          '/esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer'
        );
      };

      return esriShapeBuffer;
    })();

    FeatureCollectionPBuffer.Feature = (function () {
      /**
       * Properties of a Feature.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IFeature
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.IValue>|null} [attributes] Feature attributes
       * @property {esriPBuffer.FeatureCollectionPBuffer.IGeometry|null} [geometry] Feature geometry
       * @property {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer|null} [shapeBuffer] Feature shapeBuffer
       * @property {esriPBuffer.FeatureCollectionPBuffer.IGeometry|null} [centroid] Feature centroid
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.IGeometry>|null} [aggregateGeometries] Feature aggregateGeometries
       * @property {esriPBuffer.FeatureCollectionPBuffer.IEnvelope|null} [envelope] Feature envelope
       */

      /**
       * Constructs a new Feature.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Feature.
       * @implements IFeature
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeature=} [properties] Properties to set
       */
      function Feature(properties) {
        this.attributes = [];
        this.aggregateGeometries = [];
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Feature attributes.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.IValue>} attributes
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.attributes = $util.emptyArray;

      /**
       * Feature geometry.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IGeometry|null|undefined} geometry
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.geometry = null;

      /**
       * Feature shapeBuffer.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer|null|undefined} shapeBuffer
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.shapeBuffer = null;

      /**
       * Feature centroid.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IGeometry|null|undefined} centroid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.centroid = null;

      /**
       * Feature aggregateGeometries.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.IGeometry>} aggregateGeometries
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.aggregateGeometries = $util.emptyArray;

      /**
       * Feature envelope.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IEnvelope|null|undefined} envelope
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.envelope = null;

      // OneOf field names bound to virtual getters and setters
      var $oneOfFields;

      /**
       * Feature compressedGeometry.
       * @member {"geometry"|"shapeBuffer"|undefined} compressedGeometry
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Object.defineProperty(Feature.prototype, 'compressedGeometry', {
        get: $util.oneOfGetter(($oneOfFields = ['geometry', 'shapeBuffer'])),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * Creates a new Feature instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeature=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Feature} Feature instance
       */
      Feature.create = function create(properties) {
        return new Feature(properties);
      };

      /**
       * Encodes the specified Feature message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Feature.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeature} message Feature message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Feature.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.attributes != null && message.attributes.length)
          for (var i = 0; i < message.attributes.length; ++i)
            $root.esriPBuffer.FeatureCollectionPBuffer.Value.encode(
              message.attributes[i],
              writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
            ).ldelim();
        if (
          message.geometry != null &&
          Object.hasOwnProperty.call(message, 'geometry')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.encode(
            message.geometry,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.shapeBuffer != null &&
          Object.hasOwnProperty.call(message, 'shapeBuffer')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
            .encode(
              message.shapeBuffer,
              writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
            )
            .ldelim();
        if (
          message.centroid != null &&
          Object.hasOwnProperty.call(message, 'centroid')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.encode(
            message.centroid,
            writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
          ).ldelim();
        if (
          message.aggregateGeometries != null &&
          message.aggregateGeometries.length
        )
          for (var i = 0; i < message.aggregateGeometries.length; ++i)
            $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.encode(
              message.aggregateGeometries[i],
              writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
            ).ldelim();
        if (
          message.envelope != null &&
          Object.hasOwnProperty.call(message, 'envelope')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.encode(
            message.envelope,
            writer.uint32(/* id 6, wireType 2 =*/ 50).fork(),
          ).ldelim();
        return writer;
      };

      /**
       * Encodes the specified Feature message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Feature.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeature} message Feature message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Feature.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Feature message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Feature} Feature
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Feature.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Feature();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              if (!(message.attributes && message.attributes.length))
                message.attributes = [];
              message.attributes.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Value.decode(
                  reader,
                  reader.uint32(),
                ),
              );
              break;
            }
            case 2: {
              message.geometry =
                $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 3: {
              message.shapeBuffer =
                $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 4: {
              message.centroid =
                $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 5: {
              if (
                !(
                  message.aggregateGeometries &&
                  message.aggregateGeometries.length
                )
              )
                message.aggregateGeometries = [];
              message.aggregateGeometries.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.decode(
                  reader,
                  reader.uint32(),
                ),
              );
              break;
            }
            case 6: {
              message.envelope =
                $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Feature message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Feature} Feature
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Feature.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Feature message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Feature.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        var properties = {};
        if (
          message.attributes != null &&
          message.hasOwnProperty('attributes')
        ) {
          if (!Array.isArray(message.attributes))
            return 'attributes: array expected';
          for (var i = 0; i < message.attributes.length; ++i) {
            var error = $root.esriPBuffer.FeatureCollectionPBuffer.Value.verify(
              message.attributes[i],
            );
            if (error) return 'attributes.' + error;
          }
        }
        if (message.geometry != null && message.hasOwnProperty('geometry')) {
          properties.compressedGeometry = 1;
          {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.verify(
                message.geometry,
              );
            if (error) return 'geometry.' + error;
          }
        }
        if (
          message.shapeBuffer != null &&
          message.hasOwnProperty('shapeBuffer')
        ) {
          if (properties.compressedGeometry === 1)
            return 'compressedGeometry: multiple values';
          properties.compressedGeometry = 1;
          {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.verify(
                message.shapeBuffer,
              );
            if (error) return 'shapeBuffer.' + error;
          }
        }
        if (message.centroid != null && message.hasOwnProperty('centroid')) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.verify(
              message.centroid,
            );
          if (error) return 'centroid.' + error;
        }
        if (
          message.aggregateGeometries != null &&
          message.hasOwnProperty('aggregateGeometries')
        ) {
          if (!Array.isArray(message.aggregateGeometries))
            return 'aggregateGeometries: array expected';
          for (var i = 0; i < message.aggregateGeometries.length; ++i) {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.verify(
                message.aggregateGeometries[i],
              );
            if (error) return 'aggregateGeometries.' + error;
          }
        }
        if (message.envelope != null && message.hasOwnProperty('envelope')) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.verify(
              message.envelope,
            );
          if (error) return 'envelope.' + error;
        }
        return null;
      };

      /**
       * Creates a Feature message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Feature} Feature
       */
      Feature.fromObject = function fromObject(object) {
        if (
          object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Feature
        )
          return object;
        var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Feature();
        if (object.attributes) {
          if (!Array.isArray(object.attributes))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Feature.attributes: array expected',
            );
          message.attributes = [];
          for (var i = 0; i < object.attributes.length; ++i) {
            if (typeof object.attributes[i] !== 'object')
              throw TypeError(
                '.esriPBuffer.FeatureCollectionPBuffer.Feature.attributes: object expected',
              );
            message.attributes[i] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Value.fromObject(
                object.attributes[i],
              );
          }
        }
        if (object.geometry != null) {
          if (typeof object.geometry !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Feature.geometry: object expected',
            );
          message.geometry =
            $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.fromObject(
              object.geometry,
            );
        }
        if (object.shapeBuffer != null) {
          if (typeof object.shapeBuffer !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Feature.shapeBuffer: object expected',
            );
          message.shapeBuffer =
            $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.fromObject(
              object.shapeBuffer,
            );
        }
        if (object.centroid != null) {
          if (typeof object.centroid !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Feature.centroid: object expected',
            );
          message.centroid =
            $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.fromObject(
              object.centroid,
            );
        }
        if (object.aggregateGeometries) {
          if (!Array.isArray(object.aggregateGeometries))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Feature.aggregateGeometries: array expected',
            );
          message.aggregateGeometries = [];
          for (var i = 0; i < object.aggregateGeometries.length; ++i) {
            if (typeof object.aggregateGeometries[i] !== 'object')
              throw TypeError(
                '.esriPBuffer.FeatureCollectionPBuffer.Feature.aggregateGeometries: object expected',
              );
            message.aggregateGeometries[i] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.fromObject(
                object.aggregateGeometries[i],
              );
          }
        }
        if (object.envelope != null) {
          if (typeof object.envelope !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Feature.envelope: object expected',
            );
          message.envelope =
            $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.fromObject(
              object.envelope,
            );
        }
        return message;
      };

      /**
       * Creates a plain object from a Feature message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Feature} message Feature
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Feature.toObject = function toObject(message, options) {
        if (!options) options = {};
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
            object.attributes[j] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Value.toObject(
                message.attributes[j],
                options,
              );
        }
        if (message.geometry != null && message.hasOwnProperty('geometry')) {
          object.geometry =
            $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.toObject(
              message.geometry,
              options,
            );
          if (options.oneofs) object.compressedGeometry = 'geometry';
        }
        if (
          message.shapeBuffer != null &&
          message.hasOwnProperty('shapeBuffer')
        ) {
          object.shapeBuffer =
            $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.toObject(
              message.shapeBuffer,
              options,
            );
          if (options.oneofs) object.compressedGeometry = 'shapeBuffer';
        }
        if (message.centroid != null && message.hasOwnProperty('centroid'))
          object.centroid =
            $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.toObject(
              message.centroid,
              options,
            );
        if (message.aggregateGeometries && message.aggregateGeometries.length) {
          object.aggregateGeometries = [];
          for (var j = 0; j < message.aggregateGeometries.length; ++j)
            object.aggregateGeometries[j] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.toObject(
                message.aggregateGeometries[j],
                options,
              );
        }
        if (message.envelope != null && message.hasOwnProperty('envelope'))
          object.envelope =
            $root.esriPBuffer.FeatureCollectionPBuffer.Envelope.toObject(
              message.envelope,
              options,
            );
        return object;
      };

      /**
       * Converts this Feature to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Feature.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Feature
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Feature.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Feature';
      };

      return Feature;
    })();

    FeatureCollectionPBuffer.UniqueIdField = (function () {
      /**
       * Properties of an UniqueIdField.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IUniqueIdField
       * @property {string|null} [name] UniqueIdField name
       * @property {boolean|null} [isSystemMaintained] UniqueIdField isSystemMaintained
       */

      /**
       * Constructs a new UniqueIdField.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents an UniqueIdField.
       * @implements IUniqueIdField
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField=} [properties] Properties to set
       */
      function UniqueIdField(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * UniqueIdField name.
       * @member {string} name
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @instance
       */
      UniqueIdField.prototype.name = '';

      /**
       * UniqueIdField isSystemMaintained.
       * @member {boolean} isSystemMaintained
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @instance
       */
      UniqueIdField.prototype.isSystemMaintained = false;

      /**
       * Creates a new UniqueIdField instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField} UniqueIdField instance
       */
      UniqueIdField.create = function create(properties) {
        return new UniqueIdField(properties);
      };

      /**
       * Encodes the specified UniqueIdField message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField} message UniqueIdField message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      UniqueIdField.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (message.name != null && Object.hasOwnProperty.call(message, 'name'))
          writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.name);
        if (
          message.isSystemMaintained != null &&
          Object.hasOwnProperty.call(message, 'isSystemMaintained')
        )
          writer
            .uint32(/* id 2, wireType 0 =*/ 16)
            .bool(message.isSystemMaintained);
        return writer;
      };

      /**
       * Encodes the specified UniqueIdField message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField} message UniqueIdField message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      UniqueIdField.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an UniqueIdField message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField} UniqueIdField
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      UniqueIdField.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.name = reader.string();
              break;
            }
            case 2: {
              message.isSystemMaintained = reader.bool();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an UniqueIdField message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField} UniqueIdField
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      UniqueIdField.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an UniqueIdField message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      UniqueIdField.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.name != null && message.hasOwnProperty('name'))
          if (!$util.isString(message.name)) return 'name: string expected';
        if (
          message.isSystemMaintained != null &&
          message.hasOwnProperty('isSystemMaintained')
        )
          if (typeof message.isSystemMaintained !== 'boolean')
            return 'isSystemMaintained: boolean expected';
        return null;
      };

      /**
       * Creates an UniqueIdField message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField} UniqueIdField
       */
      UniqueIdField.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField();
        if (object.name != null) message.name = String(object.name);
        if (object.isSystemMaintained != null)
          message.isSystemMaintained = Boolean(object.isSystemMaintained);
        return message;
      };

      /**
       * Creates a plain object from an UniqueIdField message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField} message UniqueIdField
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      UniqueIdField.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.name = '';
          object.isSystemMaintained = false;
        }
        if (message.name != null && message.hasOwnProperty('name'))
          object.name = message.name;
        if (
          message.isSystemMaintained != null &&
          message.hasOwnProperty('isSystemMaintained')
        )
          object.isSystemMaintained = message.isSystemMaintained;
        return object;
      };

      /**
       * Converts this UniqueIdField to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      UniqueIdField.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for UniqueIdField
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      UniqueIdField.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.UniqueIdField'
        );
      };

      return UniqueIdField;
    })();

    FeatureCollectionPBuffer.GeometryProperties = (function () {
      /**
       * Properties of a GeometryProperties.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IGeometryProperties
       * @property {string|null} [shapeAreaFieldName] GeometryProperties shapeAreaFieldName
       * @property {string|null} [shapeLengthFieldName] GeometryProperties shapeLengthFieldName
       * @property {string|null} [units] GeometryProperties units
       */

      /**
       * Constructs a new GeometryProperties.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a GeometryProperties.
       * @implements IGeometryProperties
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties=} [properties] Properties to set
       */
      function GeometryProperties(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * GeometryProperties shapeAreaFieldName.
       * @member {string} shapeAreaFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       */
      GeometryProperties.prototype.shapeAreaFieldName = '';

      /**
       * GeometryProperties shapeLengthFieldName.
       * @member {string} shapeLengthFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       */
      GeometryProperties.prototype.shapeLengthFieldName = '';

      /**
       * GeometryProperties units.
       * @member {string} units
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       */
      GeometryProperties.prototype.units = '';

      /**
       * Creates a new GeometryProperties instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties} GeometryProperties instance
       */
      GeometryProperties.create = function create(properties) {
        return new GeometryProperties(properties);
      };

      /**
       * Encodes the specified GeometryProperties message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties} message GeometryProperties message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      GeometryProperties.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.shapeAreaFieldName != null &&
          Object.hasOwnProperty.call(message, 'shapeAreaFieldName')
        )
          writer
            .uint32(/* id 1, wireType 2 =*/ 10)
            .string(message.shapeAreaFieldName);
        if (
          message.shapeLengthFieldName != null &&
          Object.hasOwnProperty.call(message, 'shapeLengthFieldName')
        )
          writer
            .uint32(/* id 2, wireType 2 =*/ 18)
            .string(message.shapeLengthFieldName);
        if (
          message.units != null &&
          Object.hasOwnProperty.call(message, 'units')
        )
          writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.units);
        return writer;
      };

      /**
       * Encodes the specified GeometryProperties message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties} message GeometryProperties message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      GeometryProperties.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a GeometryProperties message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties} GeometryProperties
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      GeometryProperties.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.shapeAreaFieldName = reader.string();
              break;
            }
            case 2: {
              message.shapeLengthFieldName = reader.string();
              break;
            }
            case 3: {
              message.units = reader.string();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a GeometryProperties message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties} GeometryProperties
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      GeometryProperties.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a GeometryProperties message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      GeometryProperties.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (
          message.shapeAreaFieldName != null &&
          message.hasOwnProperty('shapeAreaFieldName')
        )
          if (!$util.isString(message.shapeAreaFieldName))
            return 'shapeAreaFieldName: string expected';
        if (
          message.shapeLengthFieldName != null &&
          message.hasOwnProperty('shapeLengthFieldName')
        )
          if (!$util.isString(message.shapeLengthFieldName))
            return 'shapeLengthFieldName: string expected';
        if (message.units != null && message.hasOwnProperty('units'))
          if (!$util.isString(message.units)) return 'units: string expected';
        return null;
      };

      /**
       * Creates a GeometryProperties message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties} GeometryProperties
       */
      GeometryProperties.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties();
        if (object.shapeAreaFieldName != null)
          message.shapeAreaFieldName = String(object.shapeAreaFieldName);
        if (object.shapeLengthFieldName != null)
          message.shapeLengthFieldName = String(object.shapeLengthFieldName);
        if (object.units != null) message.units = String(object.units);
        return message;
      };

      /**
       * Creates a plain object from a GeometryProperties message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties} message GeometryProperties
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      GeometryProperties.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.shapeAreaFieldName = '';
          object.shapeLengthFieldName = '';
          object.units = '';
        }
        if (
          message.shapeAreaFieldName != null &&
          message.hasOwnProperty('shapeAreaFieldName')
        )
          object.shapeAreaFieldName = message.shapeAreaFieldName;
        if (
          message.shapeLengthFieldName != null &&
          message.hasOwnProperty('shapeLengthFieldName')
        )
          object.shapeLengthFieldName = message.shapeLengthFieldName;
        if (message.units != null && message.hasOwnProperty('units'))
          object.units = message.units;
        return object;
      };

      /**
       * Converts this GeometryProperties to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      GeometryProperties.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for GeometryProperties
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      GeometryProperties.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix +
          '/esriPBuffer.FeatureCollectionPBuffer.GeometryProperties'
        );
      };

      return GeometryProperties;
    })();

    FeatureCollectionPBuffer.ServerGens = (function () {
      /**
       * Properties of a ServerGens.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IServerGens
       * @property {number|Long|null} [minServerGen] ServerGens minServerGen
       * @property {number|Long|null} [serverGen] ServerGens serverGen
       */

      /**
       * Constructs a new ServerGens.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a ServerGens.
       * @implements IServerGens
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IServerGens=} [properties] Properties to set
       */
      function ServerGens(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * ServerGens minServerGen.
       * @member {number|Long} minServerGen
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @instance
       */
      ServerGens.prototype.minServerGen = $util.Long
        ? $util.Long.fromBits(0, 0, true)
        : 0;

      /**
       * ServerGens serverGen.
       * @member {number|Long} serverGen
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @instance
       */
      ServerGens.prototype.serverGen = $util.Long
        ? $util.Long.fromBits(0, 0, true)
        : 0;

      /**
       * Creates a new ServerGens instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IServerGens=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ServerGens} ServerGens instance
       */
      ServerGens.create = function create(properties) {
        return new ServerGens(properties);
      };

      /**
       * Encodes the specified ServerGens message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.ServerGens.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IServerGens} message ServerGens message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      ServerGens.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.minServerGen != null &&
          Object.hasOwnProperty.call(message, 'minServerGen')
        )
          writer.uint32(/* id 1, wireType 0 =*/ 8).uint64(message.minServerGen);
        if (
          message.serverGen != null &&
          Object.hasOwnProperty.call(message, 'serverGen')
        )
          writer.uint32(/* id 2, wireType 0 =*/ 16).uint64(message.serverGen);
        return writer;
      };

      /**
       * Encodes the specified ServerGens message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.ServerGens.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IServerGens} message ServerGens message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      ServerGens.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a ServerGens message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ServerGens} ServerGens
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      ServerGens.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.minServerGen = reader.uint64();
              break;
            }
            case 2: {
              message.serverGen = reader.uint64();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a ServerGens message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ServerGens} ServerGens
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      ServerGens.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a ServerGens message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      ServerGens.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (
          message.minServerGen != null &&
          message.hasOwnProperty('minServerGen')
        )
          if (
            !$util.isInteger(message.minServerGen) &&
            !(
              message.minServerGen &&
              $util.isInteger(message.minServerGen.low) &&
              $util.isInteger(message.minServerGen.high)
            )
          )
            return 'minServerGen: integer|Long expected';
        if (message.serverGen != null && message.hasOwnProperty('serverGen'))
          if (
            !$util.isInteger(message.serverGen) &&
            !(
              message.serverGen &&
              $util.isInteger(message.serverGen.low) &&
              $util.isInteger(message.serverGen.high)
            )
          )
            return 'serverGen: integer|Long expected';
        return null;
      };

      /**
       * Creates a ServerGens message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ServerGens} ServerGens
       */
      ServerGens.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens();
        if (object.minServerGen != null)
          if ($util.Long)
            (message.minServerGen = $util.Long.fromValue(
              object.minServerGen,
            )).unsigned = true;
          else if (typeof object.minServerGen === 'string')
            message.minServerGen = parseInt(object.minServerGen, 10);
          else if (typeof object.minServerGen === 'number')
            message.minServerGen = object.minServerGen;
          else if (typeof object.minServerGen === 'object')
            message.minServerGen = new $util.LongBits(
              object.minServerGen.low >>> 0,
              object.minServerGen.high >>> 0,
            ).toNumber(true);
        if (object.serverGen != null)
          if ($util.Long)
            (message.serverGen = $util.Long.fromValue(
              object.serverGen,
            )).unsigned = true;
          else if (typeof object.serverGen === 'string')
            message.serverGen = parseInt(object.serverGen, 10);
          else if (typeof object.serverGen === 'number')
            message.serverGen = object.serverGen;
          else if (typeof object.serverGen === 'object')
            message.serverGen = new $util.LongBits(
              object.serverGen.low >>> 0,
              object.serverGen.high >>> 0,
            ).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from a ServerGens message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ServerGens} message ServerGens
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      ServerGens.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          if ($util.Long) {
            var long = new $util.Long(0, 0, true);
            object.minServerGen =
              options.longs === String
                ? long.toString()
                : options.longs === Number
                  ? long.toNumber()
                  : long;
          } else object.minServerGen = options.longs === String ? '0' : 0;
          if ($util.Long) {
            var long = new $util.Long(0, 0, true);
            object.serverGen =
              options.longs === String
                ? long.toString()
                : options.longs === Number
                  ? long.toNumber()
                  : long;
          } else object.serverGen = options.longs === String ? '0' : 0;
        }
        if (
          message.minServerGen != null &&
          message.hasOwnProperty('minServerGen')
        )
          if (typeof message.minServerGen === 'number')
            object.minServerGen =
              options.longs === String
                ? String(message.minServerGen)
                : message.minServerGen;
          else
            object.minServerGen =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.minServerGen)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.minServerGen.low >>> 0,
                      message.minServerGen.high >>> 0,
                    ).toNumber(true)
                  : message.minServerGen;
        if (message.serverGen != null && message.hasOwnProperty('serverGen'))
          if (typeof message.serverGen === 'number')
            object.serverGen =
              options.longs === String
                ? String(message.serverGen)
                : message.serverGen;
          else
            object.serverGen =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.serverGen)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.serverGen.low >>> 0,
                      message.serverGen.high >>> 0,
                    ).toNumber(true)
                  : message.serverGen;
        return object;
      };

      /**
       * Converts this ServerGens to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      ServerGens.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for ServerGens
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ServerGens
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      ServerGens.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.ServerGens'
        );
      };

      return ServerGens;
    })();

    FeatureCollectionPBuffer.Scale = (function () {
      /**
       * Properties of a Scale.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IScale
       * @property {number|null} [xScale] Scale xScale
       * @property {number|null} [yScale] Scale yScale
       * @property {number|null} [mScale] Scale mScale
       * @property {number|null} [zScale] Scale zScale
       */

      /**
       * Constructs a new Scale.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Scale.
       * @implements IScale
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IScale=} [properties] Properties to set
       */
      function Scale(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Scale xScale.
       * @member {number} xScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.xScale = 0;

      /**
       * Scale yScale.
       * @member {number} yScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.yScale = 0;

      /**
       * Scale mScale.
       * @member {number} mScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.mScale = 0;

      /**
       * Scale zScale.
       * @member {number} zScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.zScale = 0;

      /**
       * Creates a new Scale instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IScale=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Scale} Scale instance
       */
      Scale.create = function create(properties) {
        return new Scale(properties);
      };

      /**
       * Encodes the specified Scale message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Scale.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IScale} message Scale message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Scale.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.xScale != null &&
          Object.hasOwnProperty.call(message, 'xScale')
        )
          writer.uint32(/* id 1, wireType 1 =*/ 9).double(message.xScale);
        if (
          message.yScale != null &&
          Object.hasOwnProperty.call(message, 'yScale')
        )
          writer.uint32(/* id 2, wireType 1 =*/ 17).double(message.yScale);
        if (
          message.mScale != null &&
          Object.hasOwnProperty.call(message, 'mScale')
        )
          writer.uint32(/* id 3, wireType 1 =*/ 25).double(message.mScale);
        if (
          message.zScale != null &&
          Object.hasOwnProperty.call(message, 'zScale')
        )
          writer.uint32(/* id 4, wireType 1 =*/ 33).double(message.zScale);
        return writer;
      };

      /**
       * Encodes the specified Scale message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Scale.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IScale} message Scale message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Scale.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Scale message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Scale} Scale
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Scale.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Scale();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.xScale = reader.double();
              break;
            }
            case 2: {
              message.yScale = reader.double();
              break;
            }
            case 3: {
              message.mScale = reader.double();
              break;
            }
            case 4: {
              message.zScale = reader.double();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Scale message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Scale} Scale
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Scale.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Scale message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Scale.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.xScale != null && message.hasOwnProperty('xScale'))
          if (typeof message.xScale !== 'number')
            return 'xScale: number expected';
        if (message.yScale != null && message.hasOwnProperty('yScale'))
          if (typeof message.yScale !== 'number')
            return 'yScale: number expected';
        if (message.mScale != null && message.hasOwnProperty('mScale'))
          if (typeof message.mScale !== 'number')
            return 'mScale: number expected';
        if (message.zScale != null && message.hasOwnProperty('zScale'))
          if (typeof message.zScale !== 'number')
            return 'zScale: number expected';
        return null;
      };

      /**
       * Creates a Scale message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Scale} Scale
       */
      Scale.fromObject = function fromObject(object) {
        if (object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Scale)
          return object;
        var message = new $root.esriPBuffer.FeatureCollectionPBuffer.Scale();
        if (object.xScale != null) message.xScale = Number(object.xScale);
        if (object.yScale != null) message.yScale = Number(object.yScale);
        if (object.mScale != null) message.mScale = Number(object.mScale);
        if (object.zScale != null) message.zScale = Number(object.zScale);
        return message;
      };

      /**
       * Creates a plain object from a Scale message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Scale} message Scale
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Scale.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.xScale = 0;
          object.yScale = 0;
          object.mScale = 0;
          object.zScale = 0;
        }
        if (message.xScale != null && message.hasOwnProperty('xScale'))
          object.xScale =
            options.json && !isFinite(message.xScale)
              ? String(message.xScale)
              : message.xScale;
        if (message.yScale != null && message.hasOwnProperty('yScale'))
          object.yScale =
            options.json && !isFinite(message.yScale)
              ? String(message.yScale)
              : message.yScale;
        if (message.mScale != null && message.hasOwnProperty('mScale'))
          object.mScale =
            options.json && !isFinite(message.mScale)
              ? String(message.mScale)
              : message.mScale;
        if (message.zScale != null && message.hasOwnProperty('zScale'))
          object.zScale =
            options.json && !isFinite(message.zScale)
              ? String(message.zScale)
              : message.zScale;
        return object;
      };

      /**
       * Converts this Scale to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Scale.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Scale
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Scale.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Scale';
      };

      return Scale;
    })();

    FeatureCollectionPBuffer.Translate = (function () {
      /**
       * Properties of a Translate.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ITranslate
       * @property {number|null} [xTranslate] Translate xTranslate
       * @property {number|null} [yTranslate] Translate yTranslate
       * @property {number|null} [mTranslate] Translate mTranslate
       * @property {number|null} [zTranslate] Translate zTranslate
       */

      /**
       * Constructs a new Translate.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Translate.
       * @implements ITranslate
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITranslate=} [properties] Properties to set
       */
      function Translate(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Translate xTranslate.
       * @member {number} xTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.xTranslate = 0;

      /**
       * Translate yTranslate.
       * @member {number} yTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.yTranslate = 0;

      /**
       * Translate mTranslate.
       * @member {number} mTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.mTranslate = 0;

      /**
       * Translate zTranslate.
       * @member {number} zTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.zTranslate = 0;

      /**
       * Creates a new Translate instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITranslate=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Translate} Translate instance
       */
      Translate.create = function create(properties) {
        return new Translate(properties);
      };

      /**
       * Encodes the specified Translate message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Translate.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITranslate} message Translate message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Translate.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.xTranslate != null &&
          Object.hasOwnProperty.call(message, 'xTranslate')
        )
          writer.uint32(/* id 1, wireType 1 =*/ 9).double(message.xTranslate);
        if (
          message.yTranslate != null &&
          Object.hasOwnProperty.call(message, 'yTranslate')
        )
          writer.uint32(/* id 2, wireType 1 =*/ 17).double(message.yTranslate);
        if (
          message.mTranslate != null &&
          Object.hasOwnProperty.call(message, 'mTranslate')
        )
          writer.uint32(/* id 3, wireType 1 =*/ 25).double(message.mTranslate);
        if (
          message.zTranslate != null &&
          Object.hasOwnProperty.call(message, 'zTranslate')
        )
          writer.uint32(/* id 4, wireType 1 =*/ 33).double(message.zTranslate);
        return writer;
      };

      /**
       * Encodes the specified Translate message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Translate.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITranslate} message Translate message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Translate.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Translate message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Translate} Translate
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Translate.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Translate();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.xTranslate = reader.double();
              break;
            }
            case 2: {
              message.yTranslate = reader.double();
              break;
            }
            case 3: {
              message.mTranslate = reader.double();
              break;
            }
            case 4: {
              message.zTranslate = reader.double();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Translate message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Translate} Translate
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Translate.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Translate message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Translate.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.xTranslate != null && message.hasOwnProperty('xTranslate'))
          if (typeof message.xTranslate !== 'number')
            return 'xTranslate: number expected';
        if (message.yTranslate != null && message.hasOwnProperty('yTranslate'))
          if (typeof message.yTranslate !== 'number')
            return 'yTranslate: number expected';
        if (message.mTranslate != null && message.hasOwnProperty('mTranslate'))
          if (typeof message.mTranslate !== 'number')
            return 'mTranslate: number expected';
        if (message.zTranslate != null && message.hasOwnProperty('zTranslate'))
          if (typeof message.zTranslate !== 'number')
            return 'zTranslate: number expected';
        return null;
      };

      /**
       * Creates a Translate message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Translate} Translate
       */
      Translate.fromObject = function fromObject(object) {
        if (
          object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Translate
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.Translate();
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

      /**
       * Creates a plain object from a Translate message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Translate} message Translate
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Translate.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.xTranslate = 0;
          object.yTranslate = 0;
          object.mTranslate = 0;
          object.zTranslate = 0;
        }
        if (message.xTranslate != null && message.hasOwnProperty('xTranslate'))
          object.xTranslate =
            options.json && !isFinite(message.xTranslate)
              ? String(message.xTranslate)
              : message.xTranslate;
        if (message.yTranslate != null && message.hasOwnProperty('yTranslate'))
          object.yTranslate =
            options.json && !isFinite(message.yTranslate)
              ? String(message.yTranslate)
              : message.yTranslate;
        if (message.mTranslate != null && message.hasOwnProperty('mTranslate'))
          object.mTranslate =
            options.json && !isFinite(message.mTranslate)
              ? String(message.mTranslate)
              : message.mTranslate;
        if (message.zTranslate != null && message.hasOwnProperty('zTranslate'))
          object.zTranslate =
            options.json && !isFinite(message.zTranslate)
              ? String(message.zTranslate)
              : message.zTranslate;
        return object;
      };

      /**
       * Converts this Translate to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Translate.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Translate
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Translate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Translate'
        );
      };

      return Translate;
    })();

    FeatureCollectionPBuffer.Transform = (function () {
      /**
       * Properties of a Transform.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ITransform
       * @property {esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion|null} [quantizeOriginPostion] Transform quantizeOriginPostion
       * @property {esriPBuffer.FeatureCollectionPBuffer.IScale|null} [scale] Transform scale
       * @property {esriPBuffer.FeatureCollectionPBuffer.ITranslate|null} [translate] Transform translate
       */

      /**
       * Constructs a new Transform.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Transform.
       * @implements ITransform
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITransform=} [properties] Properties to set
       */
      function Transform(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Transform quantizeOriginPostion.
       * @member {esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion} quantizeOriginPostion
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       */
      Transform.prototype.quantizeOriginPostion = 0;

      /**
       * Transform scale.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IScale|null|undefined} scale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       */
      Transform.prototype.scale = null;

      /**
       * Transform translate.
       * @member {esriPBuffer.FeatureCollectionPBuffer.ITranslate|null|undefined} translate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       */
      Transform.prototype.translate = null;

      /**
       * Creates a new Transform instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITransform=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Transform} Transform instance
       */
      Transform.create = function create(properties) {
        return new Transform(properties);
      };

      /**
       * Encodes the specified Transform message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Transform.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITransform} message Transform message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Transform.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.quantizeOriginPostion != null &&
          Object.hasOwnProperty.call(message, 'quantizeOriginPostion')
        )
          writer
            .uint32(/* id 1, wireType 0 =*/ 8)
            .int32(message.quantizeOriginPostion);
        if (
          message.scale != null &&
          Object.hasOwnProperty.call(message, 'scale')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Scale.encode(
            message.scale,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.translate != null &&
          Object.hasOwnProperty.call(message, 'translate')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Translate.encode(
            message.translate,
            writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          ).ldelim();
        return writer;
      };

      /**
       * Encodes the specified Transform message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.Transform.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITransform} message Transform message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      Transform.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a Transform message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Transform} Transform
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Transform.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Transform();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.quantizeOriginPostion = reader.int32();
              break;
            }
            case 2: {
              message.scale =
                $root.esriPBuffer.FeatureCollectionPBuffer.Scale.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 3: {
              message.translate =
                $root.esriPBuffer.FeatureCollectionPBuffer.Translate.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a Transform message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Transform} Transform
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Transform.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a Transform message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      Transform.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (
          message.quantizeOriginPostion != null &&
          message.hasOwnProperty('quantizeOriginPostion')
        )
          switch (message.quantizeOriginPostion) {
            default:
              return 'quantizeOriginPostion: enum value expected';
            case 0:
            case 1:
              break;
          }
        if (message.scale != null && message.hasOwnProperty('scale')) {
          var error = $root.esriPBuffer.FeatureCollectionPBuffer.Scale.verify(
            message.scale,
          );
          if (error) return 'scale.' + error;
        }
        if (message.translate != null && message.hasOwnProperty('translate')) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.Translate.verify(
              message.translate,
            );
          if (error) return 'translate.' + error;
        }
        return null;
      };

      /**
       * Creates a Transform message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Transform} Transform
       */
      Transform.fromObject = function fromObject(object) {
        if (
          object instanceof $root.esriPBuffer.FeatureCollectionPBuffer.Transform
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.Transform();
        switch (object.quantizeOriginPostion) {
          default:
            if (typeof object.quantizeOriginPostion === 'number') {
              message.quantizeOriginPostion = object.quantizeOriginPostion;
              break;
            }
            break;
          case 'upperLeft':
          case 0:
            message.quantizeOriginPostion = 0;
            break;
          case 'lowerLeft':
          case 1:
            message.quantizeOriginPostion = 1;
            break;
        }
        if (object.scale != null) {
          if (typeof object.scale !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Transform.scale: object expected',
            );
          message.scale =
            $root.esriPBuffer.FeatureCollectionPBuffer.Scale.fromObject(
              object.scale,
            );
        }
        if (object.translate != null) {
          if (typeof object.translate !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.Transform.translate: object expected',
            );
          message.translate =
            $root.esriPBuffer.FeatureCollectionPBuffer.Translate.fromObject(
              object.translate,
            );
        }
        return message;
      };

      /**
       * Creates a plain object from a Transform message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.Transform} message Transform
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      Transform.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults) {
          object.quantizeOriginPostion =
            options.enums === String ? 'upperLeft' : 0;
          object.scale = null;
          object.translate = null;
        }
        if (
          message.quantizeOriginPostion != null &&
          message.hasOwnProperty('quantizeOriginPostion')
        )
          object.quantizeOriginPostion =
            options.enums === String
              ? $root.esriPBuffer.FeatureCollectionPBuffer
                  .QuantizeOriginPostion[message.quantizeOriginPostion] ===
                undefined
                ? message.quantizeOriginPostion
                : $root.esriPBuffer.FeatureCollectionPBuffer
                    .QuantizeOriginPostion[message.quantizeOriginPostion]
              : message.quantizeOriginPostion;
        if (message.scale != null && message.hasOwnProperty('scale'))
          object.scale =
            $root.esriPBuffer.FeatureCollectionPBuffer.Scale.toObject(
              message.scale,
              options,
            );
        if (message.translate != null && message.hasOwnProperty('translate'))
          object.translate =
            $root.esriPBuffer.FeatureCollectionPBuffer.Translate.toObject(
              message.translate,
              options,
            );
        return object;
      };

      /**
       * Converts this Transform to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      Transform.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for Transform
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      Transform.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.Transform'
        );
      };

      return Transform;
    })();

    FeatureCollectionPBuffer.FeatureResult = (function () {
      /**
       * Properties of a FeatureResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IFeatureResult
       * @property {string|null} [objectIdFieldName] FeatureResult objectIdFieldName
       * @property {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField|null} [uniqueIdField] FeatureResult uniqueIdField
       * @property {string|null} [globalIdFieldName] FeatureResult globalIdFieldName
       * @property {string|null} [geohashFieldName] FeatureResult geohashFieldName
       * @property {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties|null} [geometryProperties] FeatureResult geometryProperties
       * @property {esriPBuffer.FeatureCollectionPBuffer.IServerGens|null} [serverGens] FeatureResult serverGens
       * @property {esriPBuffer.FeatureCollectionPBuffer.GeometryType|null} [geometryType] FeatureResult geometryType
       * @property {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference|null} [spatialReference] FeatureResult spatialReference
       * @property {boolean|null} [exceededTransferLimit] FeatureResult exceededTransferLimit
       * @property {boolean|null} [hasZ] FeatureResult hasZ
       * @property {boolean|null} [hasM] FeatureResult hasM
       * @property {esriPBuffer.FeatureCollectionPBuffer.ITransform|null} [transform] FeatureResult transform
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.IField>|null} [fields] FeatureResult fields
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.IValue>|null} [values] FeatureResult values
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.IFeature>|null} [features] FeatureResult features
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.IGeometryField>|null} [geometryFields] FeatureResult geometryFields
       */

      /**
       * Constructs a new FeatureResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a FeatureResult.
       * @implements IFeatureResult
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult=} [properties] Properties to set
       */
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

      /**
       * FeatureResult objectIdFieldName.
       * @member {string} objectIdFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.objectIdFieldName = '';

      /**
       * FeatureResult uniqueIdField.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField|null|undefined} uniqueIdField
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.uniqueIdField = null;

      /**
       * FeatureResult globalIdFieldName.
       * @member {string} globalIdFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.globalIdFieldName = '';

      /**
       * FeatureResult geohashFieldName.
       * @member {string} geohashFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geohashFieldName = '';

      /**
       * FeatureResult geometryProperties.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties|null|undefined} geometryProperties
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geometryProperties = null;

      /**
       * FeatureResult serverGens.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IServerGens|null|undefined} serverGens
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.serverGens = null;

      /**
       * FeatureResult geometryType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.GeometryType} geometryType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geometryType = 0;

      /**
       * FeatureResult spatialReference.
       * @member {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference|null|undefined} spatialReference
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.spatialReference = null;

      /**
       * FeatureResult exceededTransferLimit.
       * @member {boolean} exceededTransferLimit
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.exceededTransferLimit = false;

      /**
       * FeatureResult hasZ.
       * @member {boolean} hasZ
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.hasZ = false;

      /**
       * FeatureResult hasM.
       * @member {boolean} hasM
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.hasM = false;

      /**
       * FeatureResult transform.
       * @member {esriPBuffer.FeatureCollectionPBuffer.ITransform|null|undefined} transform
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.transform = null;

      /**
       * FeatureResult fields.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.IField>} fields
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.fields = $util.emptyArray;

      /**
       * FeatureResult values.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.IValue>} values
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.values = $util.emptyArray;

      /**
       * FeatureResult features.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.IFeature>} features
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.features = $util.emptyArray;

      /**
       * FeatureResult geometryFields.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.IGeometryField>} geometryFields
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geometryFields = $util.emptyArray;

      /**
       * Creates a new FeatureResult instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.FeatureResult} FeatureResult instance
       */
      FeatureResult.create = function create(properties) {
        return new FeatureResult(properties);
      };

      /**
       * Encodes the specified FeatureResult message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.FeatureResult.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult} message FeatureResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      FeatureResult.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.objectIdFieldName != null &&
          Object.hasOwnProperty.call(message, 'objectIdFieldName')
        )
          writer
            .uint32(/* id 1, wireType 2 =*/ 10)
            .string(message.objectIdFieldName);
        if (
          message.uniqueIdField != null &&
          Object.hasOwnProperty.call(message, 'uniqueIdField')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.encode(
            message.uniqueIdField,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.globalIdFieldName != null &&
          Object.hasOwnProperty.call(message, 'globalIdFieldName')
        )
          writer
            .uint32(/* id 3, wireType 2 =*/ 26)
            .string(message.globalIdFieldName);
        if (
          message.geohashFieldName != null &&
          Object.hasOwnProperty.call(message, 'geohashFieldName')
        )
          writer
            .uint32(/* id 4, wireType 2 =*/ 34)
            .string(message.geohashFieldName);
        if (
          message.geometryProperties != null &&
          Object.hasOwnProperty.call(message, 'geometryProperties')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.encode(
            message.geometryProperties,
            writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          ).ldelim();
        if (
          message.serverGens != null &&
          Object.hasOwnProperty.call(message, 'serverGens')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.encode(
            message.serverGens,
            writer.uint32(/* id 6, wireType 2 =*/ 50).fork(),
          ).ldelim();
        if (
          message.geometryType != null &&
          Object.hasOwnProperty.call(message, 'geometryType')
        )
          writer.uint32(/* id 7, wireType 0 =*/ 56).int32(message.geometryType);
        if (
          message.spatialReference != null &&
          Object.hasOwnProperty.call(message, 'spatialReference')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.encode(
            message.spatialReference,
            writer.uint32(/* id 8, wireType 2 =*/ 66).fork(),
          ).ldelim();
        if (
          message.exceededTransferLimit != null &&
          Object.hasOwnProperty.call(message, 'exceededTransferLimit')
        )
          writer
            .uint32(/* id 9, wireType 0 =*/ 72)
            .bool(message.exceededTransferLimit);
        if (message.hasZ != null && Object.hasOwnProperty.call(message, 'hasZ'))
          writer.uint32(/* id 10, wireType 0 =*/ 80).bool(message.hasZ);
        if (message.hasM != null && Object.hasOwnProperty.call(message, 'hasM'))
          writer.uint32(/* id 11, wireType 0 =*/ 88).bool(message.hasM);
        if (
          message.transform != null &&
          Object.hasOwnProperty.call(message, 'transform')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.Transform.encode(
            message.transform,
            writer.uint32(/* id 12, wireType 2 =*/ 98).fork(),
          ).ldelim();
        if (message.fields != null && message.fields.length)
          for (var i = 0; i < message.fields.length; ++i)
            $root.esriPBuffer.FeatureCollectionPBuffer.Field.encode(
              message.fields[i],
              writer.uint32(/* id 13, wireType 2 =*/ 106).fork(),
            ).ldelim();
        if (message.values != null && message.values.length)
          for (var i = 0; i < message.values.length; ++i)
            $root.esriPBuffer.FeatureCollectionPBuffer.Value.encode(
              message.values[i],
              writer.uint32(/* id 14, wireType 2 =*/ 114).fork(),
            ).ldelim();
        if (message.features != null && message.features.length)
          for (var i = 0; i < message.features.length; ++i)
            $root.esriPBuffer.FeatureCollectionPBuffer.Feature.encode(
              message.features[i],
              writer.uint32(/* id 15, wireType 2 =*/ 122).fork(),
            ).ldelim();
        if (message.geometryFields != null && message.geometryFields.length)
          for (var i = 0; i < message.geometryFields.length; ++i)
            $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.encode(
              message.geometryFields[i],
              writer.uint32(/* id 16, wireType 2 =*/ 130).fork(),
            ).ldelim();
        return writer;
      };

      /**
       * Encodes the specified FeatureResult message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.FeatureResult.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult} message FeatureResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      FeatureResult.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a FeatureResult message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.FeatureResult} FeatureResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      FeatureResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.objectIdFieldName = reader.string();
              break;
            }
            case 2: {
              message.uniqueIdField =
                $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 3: {
              message.globalIdFieldName = reader.string();
              break;
            }
            case 4: {
              message.geohashFieldName = reader.string();
              break;
            }
            case 5: {
              message.geometryProperties =
                $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 6: {
              message.serverGens =
                $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 7: {
              message.geometryType = reader.int32();
              break;
            }
            case 8: {
              message.spatialReference =
                $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 9: {
              message.exceededTransferLimit = reader.bool();
              break;
            }
            case 10: {
              message.hasZ = reader.bool();
              break;
            }
            case 11: {
              message.hasM = reader.bool();
              break;
            }
            case 12: {
              message.transform =
                $root.esriPBuffer.FeatureCollectionPBuffer.Transform.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 13: {
              if (!(message.fields && message.fields.length))
                message.fields = [];
              message.fields.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Field.decode(
                  reader,
                  reader.uint32(),
                ),
              );
              break;
            }
            case 14: {
              if (!(message.values && message.values.length))
                message.values = [];
              message.values.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Value.decode(
                  reader,
                  reader.uint32(),
                ),
              );
              break;
            }
            case 15: {
              if (!(message.features && message.features.length))
                message.features = [];
              message.features.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Feature.decode(
                  reader,
                  reader.uint32(),
                ),
              );
              break;
            }
            case 16: {
              if (!(message.geometryFields && message.geometryFields.length))
                message.geometryFields = [];
              message.geometryFields.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.decode(
                  reader,
                  reader.uint32(),
                ),
              );
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a FeatureResult message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.FeatureResult} FeatureResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      FeatureResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a FeatureResult message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      FeatureResult.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (
          message.objectIdFieldName != null &&
          message.hasOwnProperty('objectIdFieldName')
        )
          if (!$util.isString(message.objectIdFieldName))
            return 'objectIdFieldName: string expected';
        if (
          message.uniqueIdField != null &&
          message.hasOwnProperty('uniqueIdField')
        ) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.verify(
              message.uniqueIdField,
            );
          if (error) return 'uniqueIdField.' + error;
        }
        if (
          message.globalIdFieldName != null &&
          message.hasOwnProperty('globalIdFieldName')
        )
          if (!$util.isString(message.globalIdFieldName))
            return 'globalIdFieldName: string expected';
        if (
          message.geohashFieldName != null &&
          message.hasOwnProperty('geohashFieldName')
        )
          if (!$util.isString(message.geohashFieldName))
            return 'geohashFieldName: string expected';
        if (
          message.geometryProperties != null &&
          message.hasOwnProperty('geometryProperties')
        ) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.verify(
              message.geometryProperties,
            );
          if (error) return 'geometryProperties.' + error;
        }
        if (
          message.serverGens != null &&
          message.hasOwnProperty('serverGens')
        ) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.verify(
              message.serverGens,
            );
          if (error) return 'serverGens.' + error;
        }
        if (
          message.geometryType != null &&
          message.hasOwnProperty('geometryType')
        )
          switch (message.geometryType) {
            default:
              return 'geometryType: enum value expected';
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 127:
            case 5:
              break;
          }
        if (
          message.spatialReference != null &&
          message.hasOwnProperty('spatialReference')
        ) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.verify(
              message.spatialReference,
            );
          if (error) return 'spatialReference.' + error;
        }
        if (
          message.exceededTransferLimit != null &&
          message.hasOwnProperty('exceededTransferLimit')
        )
          if (typeof message.exceededTransferLimit !== 'boolean')
            return 'exceededTransferLimit: boolean expected';
        if (message.hasZ != null && message.hasOwnProperty('hasZ'))
          if (typeof message.hasZ !== 'boolean')
            return 'hasZ: boolean expected';
        if (message.hasM != null && message.hasOwnProperty('hasM'))
          if (typeof message.hasM !== 'boolean')
            return 'hasM: boolean expected';
        if (message.transform != null && message.hasOwnProperty('transform')) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.Transform.verify(
              message.transform,
            );
          if (error) return 'transform.' + error;
        }
        if (message.fields != null && message.hasOwnProperty('fields')) {
          if (!Array.isArray(message.fields)) return 'fields: array expected';
          for (var i = 0; i < message.fields.length; ++i) {
            var error = $root.esriPBuffer.FeatureCollectionPBuffer.Field.verify(
              message.fields[i],
            );
            if (error) return 'fields.' + error;
          }
        }
        if (message.values != null && message.hasOwnProperty('values')) {
          if (!Array.isArray(message.values)) return 'values: array expected';
          for (var i = 0; i < message.values.length; ++i) {
            var error = $root.esriPBuffer.FeatureCollectionPBuffer.Value.verify(
              message.values[i],
            );
            if (error) return 'values.' + error;
          }
        }
        if (message.features != null && message.hasOwnProperty('features')) {
          if (!Array.isArray(message.features))
            return 'features: array expected';
          for (var i = 0; i < message.features.length; ++i) {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.Feature.verify(
                message.features[i],
              );
            if (error) return 'features.' + error;
          }
        }
        if (
          message.geometryFields != null &&
          message.hasOwnProperty('geometryFields')
        ) {
          if (!Array.isArray(message.geometryFields))
            return 'geometryFields: array expected';
          for (var i = 0; i < message.geometryFields.length; ++i) {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.verify(
                message.geometryFields[i],
              );
            if (error) return 'geometryFields.' + error;
          }
        }
        return null;
      };

      /**
       * Creates a FeatureResult message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.FeatureResult} FeatureResult
       */
      FeatureResult.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult();
        if (object.objectIdFieldName != null)
          message.objectIdFieldName = String(object.objectIdFieldName);
        if (object.uniqueIdField != null) {
          if (typeof object.uniqueIdField !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.uniqueIdField: object expected',
            );
          message.uniqueIdField =
            $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.fromObject(
              object.uniqueIdField,
            );
        }
        if (object.globalIdFieldName != null)
          message.globalIdFieldName = String(object.globalIdFieldName);
        if (object.geohashFieldName != null)
          message.geohashFieldName = String(object.geohashFieldName);
        if (object.geometryProperties != null) {
          if (typeof object.geometryProperties !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.geometryProperties: object expected',
            );
          message.geometryProperties =
            $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.fromObject(
              object.geometryProperties,
            );
        }
        if (object.serverGens != null) {
          if (typeof object.serverGens !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.serverGens: object expected',
            );
          message.serverGens =
            $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.fromObject(
              object.serverGens,
            );
        }
        switch (object.geometryType) {
          default:
            if (typeof object.geometryType === 'number') {
              message.geometryType = object.geometryType;
              break;
            }
            break;
          case 'esriGeometryTypePoint':
          case 0:
            message.geometryType = 0;
            break;
          case 'esriGeometryTypeMultipoint':
          case 1:
            message.geometryType = 1;
            break;
          case 'esriGeometryTypePolyline':
          case 2:
            message.geometryType = 2;
            break;
          case 'esriGeometryTypePolygon':
          case 3:
            message.geometryType = 3;
            break;
          case 'esriGeometryTypeMultipatch':
          case 4:
            message.geometryType = 4;
            break;
          case 'esriGeometryTypeNone':
          case 127:
            message.geometryType = 127;
            break;
          case 'esriGeometryTypeEnvelope':
          case 5:
            message.geometryType = 5;
            break;
        }
        if (object.spatialReference != null) {
          if (typeof object.spatialReference !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.spatialReference: object expected',
            );
          message.spatialReference =
            $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.fromObject(
              object.spatialReference,
            );
        }
        if (object.exceededTransferLimit != null)
          message.exceededTransferLimit = Boolean(object.exceededTransferLimit);
        if (object.hasZ != null) message.hasZ = Boolean(object.hasZ);
        if (object.hasM != null) message.hasM = Boolean(object.hasM);
        if (object.transform != null) {
          if (typeof object.transform !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.transform: object expected',
            );
          message.transform =
            $root.esriPBuffer.FeatureCollectionPBuffer.Transform.fromObject(
              object.transform,
            );
        }
        if (object.fields) {
          if (!Array.isArray(object.fields))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.fields: array expected',
            );
          message.fields = [];
          for (var i = 0; i < object.fields.length; ++i) {
            if (typeof object.fields[i] !== 'object')
              throw TypeError(
                '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.fields: object expected',
              );
            message.fields[i] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Field.fromObject(
                object.fields[i],
              );
          }
        }
        if (object.values) {
          if (!Array.isArray(object.values))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.values: array expected',
            );
          message.values = [];
          for (var i = 0; i < object.values.length; ++i) {
            if (typeof object.values[i] !== 'object')
              throw TypeError(
                '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.values: object expected',
              );
            message.values[i] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Value.fromObject(
                object.values[i],
              );
          }
        }
        if (object.features) {
          if (!Array.isArray(object.features))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.features: array expected',
            );
          message.features = [];
          for (var i = 0; i < object.features.length; ++i) {
            if (typeof object.features[i] !== 'object')
              throw TypeError(
                '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.features: object expected',
              );
            message.features[i] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Feature.fromObject(
                object.features[i],
              );
          }
        }
        if (object.geometryFields) {
          if (!Array.isArray(object.geometryFields))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.geometryFields: array expected',
            );
          message.geometryFields = [];
          for (var i = 0; i < object.geometryFields.length; ++i) {
            if (typeof object.geometryFields[i] !== 'object')
              throw TypeError(
                '.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.geometryFields: object expected',
              );
            message.geometryFields[i] =
              $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.fromObject(
                object.geometryFields[i],
              );
          }
        }
        return message;
      };

      /**
       * Creates a plain object from a FeatureResult message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.FeatureResult} message FeatureResult
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      FeatureResult.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.arrays || options.defaults) {
          object.fields = [];
          object.values = [];
          object.features = [];
          object.geometryFields = [];
        }
        if (options.defaults) {
          object.objectIdFieldName = '';
          object.uniqueIdField = null;
          object.globalIdFieldName = '';
          object.geohashFieldName = '';
          object.geometryProperties = null;
          object.serverGens = null;
          object.geometryType =
            options.enums === String ? 'esriGeometryTypePoint' : 0;
          object.spatialReference = null;
          object.exceededTransferLimit = false;
          object.hasZ = false;
          object.hasM = false;
          object.transform = null;
        }
        if (
          message.objectIdFieldName != null &&
          message.hasOwnProperty('objectIdFieldName')
        )
          object.objectIdFieldName = message.objectIdFieldName;
        if (
          message.uniqueIdField != null &&
          message.hasOwnProperty('uniqueIdField')
        )
          object.uniqueIdField =
            $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.toObject(
              message.uniqueIdField,
              options,
            );
        if (
          message.globalIdFieldName != null &&
          message.hasOwnProperty('globalIdFieldName')
        )
          object.globalIdFieldName = message.globalIdFieldName;
        if (
          message.geohashFieldName != null &&
          message.hasOwnProperty('geohashFieldName')
        )
          object.geohashFieldName = message.geohashFieldName;
        if (
          message.geometryProperties != null &&
          message.hasOwnProperty('geometryProperties')
        )
          object.geometryProperties =
            $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.toObject(
              message.geometryProperties,
              options,
            );
        if (message.serverGens != null && message.hasOwnProperty('serverGens'))
          object.serverGens =
            $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.toObject(
              message.serverGens,
              options,
            );
        if (
          message.geometryType != null &&
          message.hasOwnProperty('geometryType')
        )
          object.geometryType =
            options.enums === String
              ? $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[
                  message.geometryType
                ] === undefined
                ? message.geometryType
                : $root.esriPBuffer.FeatureCollectionPBuffer.GeometryType[
                    message.geometryType
                  ]
              : message.geometryType;
        if (
          message.spatialReference != null &&
          message.hasOwnProperty('spatialReference')
        )
          object.spatialReference =
            $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.toObject(
              message.spatialReference,
              options,
            );
        if (
          message.exceededTransferLimit != null &&
          message.hasOwnProperty('exceededTransferLimit')
        )
          object.exceededTransferLimit = message.exceededTransferLimit;
        if (message.hasZ != null && message.hasOwnProperty('hasZ'))
          object.hasZ = message.hasZ;
        if (message.hasM != null && message.hasOwnProperty('hasM'))
          object.hasM = message.hasM;
        if (message.transform != null && message.hasOwnProperty('transform'))
          object.transform =
            $root.esriPBuffer.FeatureCollectionPBuffer.Transform.toObject(
              message.transform,
              options,
            );
        if (message.fields && message.fields.length) {
          object.fields = [];
          for (var j = 0; j < message.fields.length; ++j)
            object.fields[j] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Field.toObject(
                message.fields[j],
                options,
              );
        }
        if (message.values && message.values.length) {
          object.values = [];
          for (var j = 0; j < message.values.length; ++j)
            object.values[j] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Value.toObject(
                message.values[j],
                options,
              );
        }
        if (message.features && message.features.length) {
          object.features = [];
          for (var j = 0; j < message.features.length; ++j)
            object.features[j] =
              $root.esriPBuffer.FeatureCollectionPBuffer.Feature.toObject(
                message.features[j],
                options,
              );
        }
        if (message.geometryFields && message.geometryFields.length) {
          object.geometryFields = [];
          for (var j = 0; j < message.geometryFields.length; ++j)
            object.geometryFields[j] =
              $root.esriPBuffer.FeatureCollectionPBuffer.GeometryField.toObject(
                message.geometryFields[j],
                options,
              );
        }
        return object;
      };

      /**
       * Converts this FeatureResult to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      FeatureResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for FeatureResult
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      FeatureResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.FeatureResult'
        );
      };

      return FeatureResult;
    })();

    FeatureCollectionPBuffer.CountResult = (function () {
      /**
       * Properties of a CountResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ICountResult
       * @property {number|Long|null} [count] CountResult count
       */

      /**
       * Constructs a new CountResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a CountResult.
       * @implements ICountResult
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ICountResult=} [properties] Properties to set
       */
      function CountResult(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * CountResult count.
       * @member {number|Long} count
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @instance
       */
      CountResult.prototype.count = $util.Long
        ? $util.Long.fromBits(0, 0, true)
        : 0;

      /**
       * Creates a new CountResult instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ICountResult=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.CountResult} CountResult instance
       */
      CountResult.create = function create(properties) {
        return new CountResult(properties);
      };

      /**
       * Encodes the specified CountResult message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.CountResult.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ICountResult} message CountResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CountResult.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.count != null &&
          Object.hasOwnProperty.call(message, 'count')
        )
          writer.uint32(/* id 1, wireType 0 =*/ 8).uint64(message.count);
        return writer;
      };

      /**
       * Encodes the specified CountResult message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.CountResult.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ICountResult} message CountResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      CountResult.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a CountResult message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.CountResult} CountResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CountResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.CountResult();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.count = reader.uint64();
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a CountResult message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.CountResult} CountResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      CountResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a CountResult message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      CountResult.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (message.count != null && message.hasOwnProperty('count'))
          if (
            !$util.isInteger(message.count) &&
            !(
              message.count &&
              $util.isInteger(message.count.low) &&
              $util.isInteger(message.count.high)
            )
          )
            return 'count: integer|Long expected';
        return null;
      };

      /**
       * Creates a CountResult message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.CountResult} CountResult
       */
      CountResult.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.CountResult
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.CountResult();
        if (object.count != null)
          if ($util.Long)
            (message.count = $util.Long.fromValue(object.count)).unsigned =
              true;
          else if (typeof object.count === 'string')
            message.count = parseInt(object.count, 10);
          else if (typeof object.count === 'number')
            message.count = object.count;
          else if (typeof object.count === 'object')
            message.count = new $util.LongBits(
              object.count.low >>> 0,
              object.count.high >>> 0,
            ).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from a CountResult message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.CountResult} message CountResult
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      CountResult.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.defaults)
          if ($util.Long) {
            var long = new $util.Long(0, 0, true);
            object.count =
              options.longs === String
                ? long.toString()
                : options.longs === Number
                  ? long.toNumber()
                  : long;
          } else object.count = options.longs === String ? '0' : 0;
        if (message.count != null && message.hasOwnProperty('count'))
          if (typeof message.count === 'number')
            object.count =
              options.longs === String ? String(message.count) : message.count;
          else
            object.count =
              options.longs === String
                ? $util.Long.prototype.toString.call(message.count)
                : options.longs === Number
                  ? new $util.LongBits(
                      message.count.low >>> 0,
                      message.count.high >>> 0,
                    ).toNumber(true)
                  : message.count;
        return object;
      };

      /**
       * Converts this CountResult to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      CountResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for CountResult
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.CountResult
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      CountResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.CountResult'
        );
      };

      return CountResult;
    })();

    FeatureCollectionPBuffer.ObjectIdsResult = (function () {
      /**
       * Properties of an ObjectIdsResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IObjectIdsResult
       * @property {string|null} [objectIdFieldName] ObjectIdsResult objectIdFieldName
       * @property {esriPBuffer.FeatureCollectionPBuffer.IServerGens|null} [serverGens] ObjectIdsResult serverGens
       * @property {Array.<number|Long>|null} [objectIds] ObjectIdsResult objectIds
       */

      /**
       * Constructs a new ObjectIdsResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents an ObjectIdsResult.
       * @implements IObjectIdsResult
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IObjectIdsResult=} [properties] Properties to set
       */
      function ObjectIdsResult(properties) {
        this.objectIds = [];
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * ObjectIdsResult objectIdFieldName.
       * @member {string} objectIdFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @instance
       */
      ObjectIdsResult.prototype.objectIdFieldName = '';

      /**
       * ObjectIdsResult serverGens.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IServerGens|null|undefined} serverGens
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @instance
       */
      ObjectIdsResult.prototype.serverGens = null;

      /**
       * ObjectIdsResult objectIds.
       * @member {Array.<number|Long>} objectIds
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @instance
       */
      ObjectIdsResult.prototype.objectIds = $util.emptyArray;

      /**
       * Creates a new ObjectIdsResult instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IObjectIdsResult=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult} ObjectIdsResult instance
       */
      ObjectIdsResult.create = function create(properties) {
        return new ObjectIdsResult(properties);
      };

      /**
       * Encodes the specified ObjectIdsResult message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IObjectIdsResult} message ObjectIdsResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      ObjectIdsResult.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.objectIdFieldName != null &&
          Object.hasOwnProperty.call(message, 'objectIdFieldName')
        )
          writer
            .uint32(/* id 1, wireType 2 =*/ 10)
            .string(message.objectIdFieldName);
        if (
          message.serverGens != null &&
          Object.hasOwnProperty.call(message, 'serverGens')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.encode(
            message.serverGens,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (message.objectIds != null && message.objectIds.length) {
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork();
          for (var i = 0; i < message.objectIds.length; ++i)
            writer.uint64(message.objectIds[i]);
          writer.ldelim();
        }
        return writer;
      };

      /**
       * Encodes the specified ObjectIdsResult message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IObjectIdsResult} message ObjectIdsResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      ObjectIdsResult.encodeDelimited = function encodeDelimited(
        message,
        writer,
      ) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an ObjectIdsResult message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult} ObjectIdsResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      ObjectIdsResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.objectIdFieldName = reader.string();
              break;
            }
            case 2: {
              message.serverGens =
                $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 3: {
              if (!(message.objectIds && message.objectIds.length))
                message.objectIds = [];
              if ((tag & 7) === 2) {
                var end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2)
                  message.objectIds.push(reader.uint64());
              } else message.objectIds.push(reader.uint64());
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an ObjectIdsResult message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult} ObjectIdsResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      ObjectIdsResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an ObjectIdsResult message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      ObjectIdsResult.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        if (
          message.objectIdFieldName != null &&
          message.hasOwnProperty('objectIdFieldName')
        )
          if (!$util.isString(message.objectIdFieldName))
            return 'objectIdFieldName: string expected';
        if (
          message.serverGens != null &&
          message.hasOwnProperty('serverGens')
        ) {
          var error =
            $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.verify(
              message.serverGens,
            );
          if (error) return 'serverGens.' + error;
        }
        if (message.objectIds != null && message.hasOwnProperty('objectIds')) {
          if (!Array.isArray(message.objectIds))
            return 'objectIds: array expected';
          for (var i = 0; i < message.objectIds.length; ++i)
            if (
              !$util.isInteger(message.objectIds[i]) &&
              !(
                message.objectIds[i] &&
                $util.isInteger(message.objectIds[i].low) &&
                $util.isInteger(message.objectIds[i].high)
              )
            )
              return 'objectIds: integer|Long[] expected';
        }
        return null;
      };

      /**
       * Creates an ObjectIdsResult message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult} ObjectIdsResult
       */
      ObjectIdsResult.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult();
        if (object.objectIdFieldName != null)
          message.objectIdFieldName = String(object.objectIdFieldName);
        if (object.serverGens != null) {
          if (typeof object.serverGens !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.serverGens: object expected',
            );
          message.serverGens =
            $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.fromObject(
              object.serverGens,
            );
        }
        if (object.objectIds) {
          if (!Array.isArray(object.objectIds))
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.objectIds: array expected',
            );
          message.objectIds = [];
          for (var i = 0; i < object.objectIds.length; ++i)
            if ($util.Long)
              (message.objectIds[i] = $util.Long.fromValue(
                object.objectIds[i],
              )).unsigned = true;
            else if (typeof object.objectIds[i] === 'string')
              message.objectIds[i] = parseInt(object.objectIds[i], 10);
            else if (typeof object.objectIds[i] === 'number')
              message.objectIds[i] = object.objectIds[i];
            else if (typeof object.objectIds[i] === 'object')
              message.objectIds[i] = new $util.LongBits(
                object.objectIds[i].low >>> 0,
                object.objectIds[i].high >>> 0,
              ).toNumber(true);
        }
        return message;
      };

      /**
       * Creates a plain object from an ObjectIdsResult message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult} message ObjectIdsResult
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      ObjectIdsResult.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (options.arrays || options.defaults) object.objectIds = [];
        if (options.defaults) {
          object.objectIdFieldName = '';
          object.serverGens = null;
        }
        if (
          message.objectIdFieldName != null &&
          message.hasOwnProperty('objectIdFieldName')
        )
          object.objectIdFieldName = message.objectIdFieldName;
        if (message.serverGens != null && message.hasOwnProperty('serverGens'))
          object.serverGens =
            $root.esriPBuffer.FeatureCollectionPBuffer.ServerGens.toObject(
              message.serverGens,
              options,
            );
        if (message.objectIds && message.objectIds.length) {
          object.objectIds = [];
          for (var j = 0; j < message.objectIds.length; ++j)
            if (typeof message.objectIds[j] === 'number')
              object.objectIds[j] =
                options.longs === String
                  ? String(message.objectIds[j])
                  : message.objectIds[j];
            else
              object.objectIds[j] =
                options.longs === String
                  ? $util.Long.prototype.toString.call(message.objectIds[j])
                  : options.longs === Number
                    ? new $util.LongBits(
                        message.objectIds[j].low >>> 0,
                        message.objectIds[j].high >>> 0,
                      ).toNumber(true)
                    : message.objectIds[j];
        }
        return object;
      };

      /**
       * Converts this ObjectIdsResult to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      ObjectIdsResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for ObjectIdsResult
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      ObjectIdsResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix +
          '/esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult'
        );
      };

      return ObjectIdsResult;
    })();

    FeatureCollectionPBuffer.QueryResult = (function () {
      /**
       * Properties of a QueryResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IQueryResult
       * @property {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult|null} [featureResult] QueryResult featureResult
       * @property {esriPBuffer.FeatureCollectionPBuffer.ICountResult|null} [countResult] QueryResult countResult
       * @property {esriPBuffer.FeatureCollectionPBuffer.IObjectIdsResult|null} [idsResult] QueryResult idsResult
       */

      /**
       * Constructs a new QueryResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a QueryResult.
       * @implements IQueryResult
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IQueryResult=} [properties] Properties to set
       */
      function QueryResult(properties) {
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * QueryResult featureResult.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult|null|undefined} featureResult
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       */
      QueryResult.prototype.featureResult = null;

      /**
       * QueryResult countResult.
       * @member {esriPBuffer.FeatureCollectionPBuffer.ICountResult|null|undefined} countResult
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       */
      QueryResult.prototype.countResult = null;

      /**
       * QueryResult idsResult.
       * @member {esriPBuffer.FeatureCollectionPBuffer.IObjectIdsResult|null|undefined} idsResult
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       */
      QueryResult.prototype.idsResult = null;

      // OneOf field names bound to virtual getters and setters
      var $oneOfFields;

      /**
       * QueryResult Results.
       * @member {"featureResult"|"countResult"|"idsResult"|undefined} Results
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       */
      Object.defineProperty(QueryResult.prototype, 'Results', {
        get: $util.oneOfGetter(
          ($oneOfFields = ['featureResult', 'countResult', 'idsResult']),
        ),
        set: $util.oneOfSetter($oneOfFields),
      });

      /**
       * Creates a new QueryResult instance using the specified properties.
       * @function create
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IQueryResult=} [properties] Properties to set
       * @returns {esriPBuffer.FeatureCollectionPBuffer.QueryResult} QueryResult instance
       */
      QueryResult.create = function create(properties) {
        return new QueryResult(properties);
      };

      /**
       * Encodes the specified QueryResult message. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.QueryResult.verify|verify} messages.
       * @function encode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IQueryResult} message QueryResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      QueryResult.encode = function encode(message, writer) {
        if (!writer) writer = $Writer.create();
        if (
          message.featureResult != null &&
          Object.hasOwnProperty.call(message, 'featureResult')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.encode(
            message.featureResult,
            writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
          ).ldelim();
        if (
          message.countResult != null &&
          Object.hasOwnProperty.call(message, 'countResult')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.encode(
            message.countResult,
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim();
        if (
          message.idsResult != null &&
          Object.hasOwnProperty.call(message, 'idsResult')
        )
          $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.encode(
            message.idsResult,
            writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          ).ldelim();
        return writer;
      };

      /**
       * Encodes the specified QueryResult message, length delimited. Does not implicitly {@link esriPBuffer.FeatureCollectionPBuffer.QueryResult.verify|verify} messages.
       * @function encodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.IQueryResult} message QueryResult message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      QueryResult.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes a QueryResult message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.QueryResult} QueryResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      QueryResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1: {
              message.featureResult =
                $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 2: {
              message.countResult =
                $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            case 3: {
              message.idsResult =
                $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.decode(
                  reader,
                  reader.uint32(),
                );
              break;
            }
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes a QueryResult message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {esriPBuffer.FeatureCollectionPBuffer.QueryResult} QueryResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      QueryResult.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader)) reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies a QueryResult message.
       * @function verify
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      QueryResult.verify = function verify(message) {
        if (typeof message !== 'object' || message === null)
          return 'object expected';
        var properties = {};
        if (
          message.featureResult != null &&
          message.hasOwnProperty('featureResult')
        ) {
          properties.Results = 1;
          {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.verify(
                message.featureResult,
              );
            if (error) return 'featureResult.' + error;
          }
        }
        if (
          message.countResult != null &&
          message.hasOwnProperty('countResult')
        ) {
          if (properties.Results === 1) return 'Results: multiple values';
          properties.Results = 1;
          {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.verify(
                message.countResult,
              );
            if (error) return 'countResult.' + error;
          }
        }
        if (message.idsResult != null && message.hasOwnProperty('idsResult')) {
          if (properties.Results === 1) return 'Results: multiple values';
          properties.Results = 1;
          {
            var error =
              $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.verify(
                message.idsResult,
              );
            if (error) return 'idsResult.' + error;
          }
        }
        return null;
      };

      /**
       * Creates a QueryResult message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {esriPBuffer.FeatureCollectionPBuffer.QueryResult} QueryResult
       */
      QueryResult.fromObject = function fromObject(object) {
        if (
          object instanceof
          $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult
        )
          return object;
        var message =
          new $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult();
        if (object.featureResult != null) {
          if (typeof object.featureResult !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.QueryResult.featureResult: object expected',
            );
          message.featureResult =
            $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.fromObject(
              object.featureResult,
            );
        }
        if (object.countResult != null) {
          if (typeof object.countResult !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.QueryResult.countResult: object expected',
            );
          message.countResult =
            $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.fromObject(
              object.countResult,
            );
        }
        if (object.idsResult != null) {
          if (typeof object.idsResult !== 'object')
            throw TypeError(
              '.esriPBuffer.FeatureCollectionPBuffer.QueryResult.idsResult: object expected',
            );
          message.idsResult =
            $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.fromObject(
              object.idsResult,
            );
        }
        return message;
      };

      /**
       * Creates a plain object from a QueryResult message. Also converts values to other types if specified.
       * @function toObject
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {esriPBuffer.FeatureCollectionPBuffer.QueryResult} message QueryResult
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      QueryResult.toObject = function toObject(message, options) {
        if (!options) options = {};
        var object = {};
        if (
          message.featureResult != null &&
          message.hasOwnProperty('featureResult')
        ) {
          object.featureResult =
            $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.toObject(
              message.featureResult,
              options,
            );
          if (options.oneofs) object.Results = 'featureResult';
        }
        if (
          message.countResult != null &&
          message.hasOwnProperty('countResult')
        ) {
          object.countResult =
            $root.esriPBuffer.FeatureCollectionPBuffer.CountResult.toObject(
              message.countResult,
              options,
            );
          if (options.oneofs) object.Results = 'countResult';
        }
        if (message.idsResult != null && message.hasOwnProperty('idsResult')) {
          object.idsResult =
            $root.esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult.toObject(
              message.idsResult,
              options,
            );
          if (options.oneofs) object.Results = 'idsResult';
        }
        return object;
      };

      /**
       * Converts this QueryResult to JSON.
       * @function toJSON
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      QueryResult.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      /**
       * Gets the default type url for QueryResult
       * @function getTypeUrl
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns {string} The default type url
       */
      QueryResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
          typeUrlPrefix = 'type.googleapis.com';
        }
        return (
          typeUrlPrefix + '/esriPBuffer.FeatureCollectionPBuffer.QueryResult'
        );
      };

      return QueryResult;
    })();

    return FeatureCollectionPBuffer;
  })();

  return esriPBuffer;
})();

module.exports = $root;
