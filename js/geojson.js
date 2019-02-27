//creates the map
function createMap(){
//defines the starting point and zoom level of the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2

    });
//imports the tile layer from the defined source
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    getData(map);
};
//creates a popup that displays the properties for each feature displayed from the data
function onEachFeature(feature, layer) {
    var popupContent = "";
    if (feature.properties) {
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};
function getData(map){
//references jquery to grab the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
//defines the variable to stylize the markers of the data imported
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#003153",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
//defines each feature and applies the custom marker to each point
          L.geoJson(response, {
              onEachFeature: onEachFeature,
              pointToLayer: function (onEachFeature, latlng){
                  return L.circleMarker(latlng, geojsonMarkerOptions);
              },
//applies a filter to the data displaying the information we want
              filter: function(feature, layer) {
                  if (feature.properties.Pop_2015 > 20) {
                      return 'true'
                  }
              }
          }).addTo(map);
          //
          // L.geoJson(response, {
          //     pointToLayer: function (feature, latlng){
          //         return L.circleMarker(latlng, geojsonMarkerOptions);
          //     }
          // }).addTo(map);
          //
          // L.geoJson(response, {
          //   filter: function(feature, layer) {
          //       return feature.properties.Pop_2015 > 20;
          //   }
          // }).addTo(map);
          //
        }
    });
};
//engages the createMap when the document has finished loading
$(document).ready(createMap);
