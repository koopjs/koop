var layerFS, map;
function koopMap( dom ){ 

  var koop = {
    map: map,
    add: addLayer,
    addTile: addTileLayer,
    addUTF: addUTF,
    remove: removeLayer 
  };   

  map = L.map( dom ).setView([45.52751668442124, -122.67175197601318], 3);
  // Add ArcGIS Online Basemap
  L.esri.basemapLayer("NationalGeographic").addTo(map);


  function addLayer( url ) {
    // Add ArcGIS Online feature service
    layerFS =  L.esri.featureLayer( url, {
        pointToLayer: function (geojson, latlng) {
          return L.marker(latlng, {
            icon:  L.icon({
              iconUrl: '/images/marker-icon.png',
              iconRetinaUrl: '/images/marker-icon-2x.png',
              iconSize: [20, 30],
              iconAnchor: [10, 25],
              popupAnchor: [0,-20],
            })
          });
        },
        onEachFeature: function(geojson, layer){
          createPopup(geojson,layer);
        }
    }).addTo(map);

    layerFS.metadata(function(err, data){
      var extent = data.extent;
      map.fitBounds([[ extent.ymin, extent.xmin], [ extent.ymax, extent.xmax ] ]);
    });
  }

  function addTileLayer( url ) {
    L.tileLayer(url, {}).addTo(map);
  }

  function addUTF(url){

    var utfGrid = new L.UtfGrid( url+ '?callback={cb}');

    utfGrid.on('click', function (e) {
      //console.log('click: ', e);
    }); 
    utfGrid.on('mouseover', function (e) {
      if (e.data) console.log('mouseover: ', e.data);
    });
    utfGrid.on('mouseout', function (e) {
      //console.log('mouseout: ', e.data);
    });
    map.addLayer(utfGrid);
  }


  function createPopup(geojson,layer) {
    // Show all data
    if (geojson.properties) {
      var popupText =  "<div style='overflow:scroll; max-width:250px; max-height:200px;'><center>";
      for (prop in geojson.properties) {
        var val = geojson.properties[prop];
        if (val) {
          popupText += "<b>" + prop + "</b>: " + val + "<br>";
        }
      }
      popupText += "</center></div>";
      layer.bindPopup(popupText);
    }
  }

  function removeLayer() {
    if (layerFS) {
      map.removeLayer(layerFS);
      layerFS = null;
    }
  }
 
  return koop; 
}
