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
// function getData(map){
// //references jquery to grab the data
//     $.ajax("data/RenewableEnergyProduction.geojson", {
//         dataType: "json",
//         success: function(response){
// //defines the variable to stylize the markers of the data imported
//             var geojsonMarkerOptions = {
//                 radius: 8,
//                 fillColor: "#c0c0c0",
//                 color: "#000",
//                 weight: 1,
//                 opacity: 1,
//                 fillOpacity: 0.8
//             };
// // defines each feature and applies the custom marker to each point
// //           L.geoJson(response, {
// //               onEachFeature: onEachFeature,
// //               pointToLayer: function (onEachFeature, latlng){
// //                   return L.circleMarker(latlng, geojsonMarkerOptions);
// //               },
// //           }).addTo(map);
//         }
//     });
// };
// function createPropSymbols(data, map){
//
//     var geojsonMarkerOptions = {
//         radius: 8,
//         fillcolor: "#003153",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     };
//
//     L.geoJson(data, {
//
//         pointToLayer: function (feature, latlng) {
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(map);
// };

//function to create symbols and assigns the settings of the symbols
function createPropSymbols(data, map){
    var attribute = "2009";
    var geojsonMarkerOptions = {
        radius: 8,
        fillcolor: "#003153",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
//function to calculate the radius of the circles based on the attribute value
function calcPropRadius(attValue) {
    var scaleFactor = 50;
    var area = attValue * scaleFactor;
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};
//creates the layer with the returned proportional symbols and settings
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            var attValue = Number(feature.properties[attribute]);
            console.log(feature.properties, attValue);
            geojsonMarkerOptions.radius = calcPropRadius(attValue);
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};
//grabs the data via ajax from the gejson file
function getData(map){
    $.ajax("data/RenewableEnergyProduction.geojson", {
        dataType: "json",
        success: function(response){
            createPropSymbols(response, map);
        }
    });
};

//engages the createMap when the document has finished loading
$(document).ready(createMap);
