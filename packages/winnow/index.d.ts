import { Feature, FeatureCollection, Geometry } from 'geojson';

/**
  * Aggregation definition
  */
export interface IAggregateDef {
  /**
   * type
   */
  type: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'first' | 'last'

  /**
   * Data field name
   */
  field: string

  /**
   * Aggregation field name
   */
  name?: string
}

/**
 * Classes-break classification definition
 */
export interface IClassesBreakClassidicationDef {
  type: 'classes',
  field: string,
  method: 'equalInterval' | 'naturalBreaks' | 'quantile' | 'std',
  breakCount: number,
  normType?: 'field' | 'log' | 'percent',
  normField?: string
}

/**
 * Unique value classification definition
 */
export interface IUniqueValueClassidicationDef {
  type: 'unique',
  fields: string[]
}

export interface IQueryOptions {
  /**
   * A sql where statement
   */
  where?: string

  /**
   * GeoJSON or Esri geometry Object
   */
  geometry?: Geometry

  /**
   * Spatial predicate
   */
  spatialPredicate?: 'ST_Within' | 'ST_Contains' | 'ST_Intersects'

  /**
   * Set of fields to select from feature properties
   */
  fields?: string[]

  /**
   * Describes the set of aggregations to perform on fields
   */
  aggregates?: IAggregateDef[]

  /**
   * Set of fields for grouping statistics
   */
  groupBy?: string[]

  /**
   * number of results to return
   */
  number?: number

  /**
   * number of return features to offset
   */
  offset?: number

  /**
   * Set of fields or aggregates by which to order results
   */
  order?: string[]

  /**
   * An EPSG code, an OGC WKT or an ESRI WKT used to convert geometry
   */
  outputCrs?: string | number

  /**
   * An EPSG code, an OGC WKT or an ESRI WKT defining the coordinate system of the input data. Defaults to 4326 (WGS84)
   */
  inputCrs?: string | number

  /**
   * Whether to return Esri feature collection
   */
  toEsri?: boolean

  /**
   * Number of digits to appear after decimal point for geometry
   */
  geometryPrecision?: number

  /**
   * GeoJSON or geoservices classification Object
   */
  classification?: IClassesBreakClassidicationDef | IUniqueValueClassidicationDef
}

/**
 * Build and apply a query to a feature collection object or an array of features
 * @param features a feature collection object or an array of features
 * @param options query options
 */
export function query(features: Feature[] | FeatureCollection, options: IQueryOptions): Feature[]