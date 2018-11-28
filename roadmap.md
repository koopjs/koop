# Koop Roadmap

1. Koop Documentation Reboot  
  * Convert site to Jekyll for better linking, TOCs, etc  
  * Overview documentation with illustrations
  * Output service documentation

2. Support non-numeric object IDs and or beyond 32-bit object IDs
  * Default output pins objectID field objects to 32-bit integers
  * Some client allow non-numeric object ID and or 64-bit numeric IDs - we should allow for this with settings in provider metadata

3. Big data support:
  * quantization (see ArcGIS RestAPI [`quantizationParameters`](https://developers.arcgis.com/rest/services-reference/query-map-service-layer-.html))
  * `pbf` output (see [here](https://github.com/mapbox/pbf))

5. New output services: 
  * WMS
  * WFS
  * Stream Service

6. Koop performance testing/benchmarking

