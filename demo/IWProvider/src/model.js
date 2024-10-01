const axios = require("axios");
const { polygon } = require("@turf/turf");
const proj4 = require("proj4");
function Model(koop) {}

const getimagesets = async function (req, callback) {
  let data = JSON.stringify({
    contains_point: {
      srs: {
        epsg: "epsg:4326",
      },
      x: -81.581224,
      y: 28.41871,
    },
    category: "IMAGESET_CATEGORY_VISUAL",
    optional_response_properties: ["IMAGESET_CAMERA_MODEL_ORTHO"],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.cmh.platform-test2.evinternal.net/imagery/v2/imagesets/search",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJraWQiOiJLQk1VTWxTQ0Y4N1E1NjEyYzJEbXQtZ0t4TE9rcWRwMF9kTjdmRk5zTGhVIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkpuZUNKVUUyVTRqNzV6LXl1ZFpEOHdjUU1KaFFzU08wTG1yNW5SaVZVUlEiLCJpc3MiOiJodHRwczovL2VhZ2xldmlldy1wbGF0Zm9ybS1kZXYub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiRWFnbGVWaWV3UGxhdGZvcm1EZXYiLCJpYXQiOjE3MjUyNTExOTgsImV4cCI6MTcyNTMzNzU5OCwiY2lkIjoiMG9hN3NxZzYxNXJPY0FRbmUxZDciLCJzY3AiOlsiZGVmYXVsdCJdLCJvcmdhbml6YXRpb25JZCI6IjQ2NDA5NjM1IiwiZXVtVXNlck5hbWUiOiIyYTY4NzI3ZC01NDUyLTQ1NGQtYjBhZS00ZmVkYzg5M2M0ZDAiLCJzdWIiOiIwb2E3c3FnNjE1ck9jQVFuZTFkNyIsImV1bVVzZXJJZCI6IjJhNjg3MjdkLTU0NTItNDU0ZC1iMGFlLTRmZWRjODkzYzRkMCIsInJhdGUiOiIwOjA6MDowOjAiLCJhcHBDb2RlIjoiSVYiLCJ1c2VyVVJOIjoiMmE2ODcyN2QtNTQ1Mi00NTRkLWIwYWUtNGZlZGM4OTNjNGQwIiwidXNlcklkIjoiMmE2ODcyN2QtNTQ1Mi00NTRkLWIwYWUtNGZlZGM4OTNjNGQwIn0.DgxgdmSmGRjYz8WG84Pr33g7_g_PUyS6NTjS4hPy6G6QXZonACI0qa_Z6P6ewbCJ12U2X5R2GYirNjEpWb9qs0gJfD0pjfASFQ2kxZGbbLHmAOuyP1loQefFsz_IzoftvwihBSLjwPGyj77mZS1Zosh-JAIHZWQIKQ-OE98c-zbiSziYUZTiTZSEV1dxzBWhGtUDX21USryTQXFPZeKihckZv7AI_KT7Pp7FVnDh9ku5hter26Q9VIsSV4e8Hwdl3GkyYH3Aq-AZAOh-BHcVXcTmQXFPMg98OED6V7-rfdHqNb0Eh-4R477RNE0MErGNt_SUIexIMj3hOpLBM33KZQ",
      Cookie:
        "AWSALBTG=Ut/GW2+sWdTkqohS8U5SjlfzQmAr5CsFe9BJNsyoNcEMXcMWy9MfpEyWQxZT2LjCR+pgpETVj5yAJy7nfqv7tYk270Ayt1gs0+XMED5OFWzE1+9fDn7kaPExP3MddA3T4on+5arSCBa7hT/bWNQpiOsTe3grlAU9iNzYCIDgSNPb; AWSALBTGCORS=Ut/GW2+sWdTkqohS8U5SjlfzQmAr5CsFe9BJNsyoNcEMXcMWy9MfpEyWQxZT2LjCR+pgpETVj5yAJy7nfqv7tYk270Ayt1gs0+XMED5OFWzE1+9fDn7kaPExP3MddA3T4on+5arSCBa7hT/bWNQpiOsTe3grlAU9iNzYCIDgSNPb",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

const getimagesetsBasedonUrn = async function name(token) {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://api.cmh.platform-test2.evinternal.net/imagery/v2/imagesets/urn:eagleview.com:v1:spatial-data:raster:visual:ated:G9kfbAjRN0i2kgIjPckDMA",
    headers: {
      Authorization:
        "Bearer " + token,
      Cookie:
        "AWSALBTG=BEcJDZJMN+NQ1icMi/Niww6frGQsBRYcSTRwiWILpYeUV4RhTWMtI2x4D7U1fDkG/QmziXX3ovaSwhJQqRNtZNIjQLYZ2a5jgzaULsO9cNdNT4WfsdMgPZoITBLy2N8I4janYRp3A75YYQKHs1xl8LfgxVxWy0du8lo+ove+8cG8; AWSALBTGCORS=BEcJDZJMN+NQ1icMi/Niww6frGQsBRYcSTRwiWILpYeUV4RhTWMtI2x4D7U1fDkG/QmziXX3ovaSwhJQqRNtZNIjQLYZ2a5jgzaULsO9cNdNT4WfsdMgPZoITBLy2N8I4janYRp3A75YYQKHs1xl8LfgxVxWy0du8lo+ove+8cG8",
    },
  };
  const response = await axios.request(config);
  return response.data;

  // axios.request(config)
  // .then((response) => {
  //   console.log(JSON.stringify(response.data));
  // })
  // .catch((error) => {
  //   console.log(error);
  // });
};

// each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = async function (req, callback) {
  let geojson = {
    type: "FeatureCollection",
    features: [],
  };
  const layerId = req.params?.layer;
  const evToken =  req.headers?.authorization?.replace('Bearer ', '');
  if (layerId) {
    if (layerId == 0) {
      console.log("layerId", layerId);

      let data =
        '{\n    "query":{\n        "operator": "LOGICAL_OPERATOR_AND",\n        "fields": [\n            {\n                "spatial_comparison": {\n                    "operator": "SPATIAL_COMPARISON_OPERATOR_CONTAINS",\n                    "point": {\n                        "srs": {\n                            "epsg": "epsg:4326"\n                        },\n                        "x": -81.581224,\n                        "y": 28.41871\n                    }\n                }\n            },\n            {\n                "ordinal_comparison": {\n                    "operator": "ORDINAL_COMPARISON_OPERATOR_GREATER_THAN",\n                    "elevation": 35\n                }\n            }\n        ]\n    },\n    "optional_response_properties": [\n\t\t"IMAGE_RESPONSE_PROPERTIES_LOOK_AT",\n\t\t"IMAGE_RESPONSE_PROPERTIES_IMAGESET_CAMERA_MODEL",\n\t\t"IMAGE_RESPONSE_PROPERTIES_IMAGESET_COMPOSITE",\n\t\t"IMAGE_RESPONSE_PROPERTIES_CALCULATED_GSD",\n\t\t"IMAGE_RESPONSE_PROPERTIES_GROUND_FOOTPRINT",\n\t\t"IMAGE_RESPONSE_PROPERTIES_ZOOM_RANGE",\n        "IMAGE_RESPONSE_PROPERTIES_IMAGESET_URN",\n        "IMAGE_RESPONSE_PROPERTIES_CENTROID",\n        "IMAGE_RESPONSE_PROPERTIES_BOUNDING_BOX_2D",\n        "IMAGE_RESPONSE_PROPERTIES_IMAGESET_BOUNDING_BOX_2D"\n\t]\n}';
      // let data = '{\n    "query":{\n        "operator": "LOGICAL_OPERATOR_AND",\n        "fields": [\n            {\n                "spatial_comparison": {\n                    "operator": "SPATIAL_COMPARISON_OPERATOR_CONTAINS",\n                    "point": {\n                        "srs": {\n                            "epsg": "epsg:4326"\n                        },\n                        "x": -81.581224,\n                        "y": 28.41871\n                    }\n                }\n            },\n            {\n                "ordinal_comparison": {\n                    "operator": "ORDINAL_COMPARISON_OPERATOR_GREATER_THAN",\n                    "elevation": 35\n                }\n            }\n        ]\n    }\n}';
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.cmh.platform-test2.evinternal.net/imagery/v2/images/query",
        headers: {
          "Content-Type": "text/plain",
          Authorization:
            "Bearer " + evToken,
        },
        data: data,
      };

      const response = await axios.request(config);

      response.data.images.map((image) => {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              image.optional.centroid?.y,
              image.optional.centroid?.x,
            ],
          },
          properties: {
            image_urn: image.image_urn,
            url: `${image.url}/tiles/{z}/{x}/{y}?format=IMAGE_FORMAT_JPEG_PNG&access_token=token`,
          },
        });
      });
      geojson = {
        ...geojson,
        metadata: {
          name: 'Imagery',
          type: 'Oriented Imagery Layer',
          geometryType: 'esriGeometryPoint',
        },
      };
      // the callback function expects a geojson for its second parameter
      callback(null, geojson);
    } else {
      const data = await getimagesetsBasedonUrn(evToken);
      const imageBoundary = polygon([
        data.ground_footprint.polygons[0].exterior.ring.map((p) =>
          proj4(
            "+proj=geocent +datum=WGS84 +units=m +no_defs",
            "EPSG:4326",
            Object.values(p)
          )
        ),
      ]);
      // console.log("layerConfigs", imageBoundary);
      geojson.features.push(imageBoundary);
      callback(null, geojson);
    }
  } else {
    // const response = await axios.get(
    //   `https://api.cmh.platform-test2.evinternal.net/poc-data-layers/dataLayers`
    // );
    // const layerConfigs = response?.data?.data;
    const layerConfigs = [
      {
        layerId: 0,
        type: "Oriented Imagery Layer",
        metadata: {
          type: "Oriented Imagery Layer",
          description: "Imagery",
          geometryType: "esriGeometryPoint",
          id: 0,
          maxRecordCount: 1000,
          maxScale: 0,
          minScale: 0,
          name: "Imagery",
          renderer: {
            symbol: {
              color: [50, 168, 166, 255],
              style: "esriSLSSolid",
              type: "esriSLS",
              width: 3,
            },
            type: "simple",
          },
        },
      },
      {
        layerId: 1,
        type: "Feature Layer",
        metadata: {
          description: "Footprint Layer",
          geometryType: "esriGeometryPolygon",
          id: 0,
          maxRecordCount: 1000,
          maxScale: 0,
          minScale: 0,
          name: "Imagery Footprint",
          renderer: {
            symbol: {
              color: [50, 168, 166, 255],
              style: "esriSLSSolid",
              type: "esriSLS",
              width: 3,
            },
            type: "simple",
          },
        },
      },
    ];
    const json = { layers: layerConfigs };
    // console.log("layerConfigs", json);
    callback(null, json);
  }
};

module.exports = Model;
