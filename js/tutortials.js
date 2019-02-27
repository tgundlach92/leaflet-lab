//Gundlach Lab 4 Tutorials
//Creates the view location for the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//creates tile layer and sets up map information and accesstoken for access
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {

  attribution: 'Map data & copy; <a href="https://www.openstreetmap.org/" >OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoidHNndW5kbGFjaCIsImEiOiJjanM5OXUwanQxZzVjNDNtczY5aXozc3o5In0.sY1MhcrSpctif5m_idp0Qw'

//adds tile layer to display
}).addTo(mymap);
console.log("Okay")

//creates a marker at lat long listed
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//creates red circle styling at lat long listed
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500

//adds marker and circle to display
}).addTo(mymap);
console.log("Okay")

//creates polygon with vertices at listed lat longs
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]

//adds polygon to display
]).addTo(mymap);
console.log("Okay")

//creates popups to bound to each of the created objects
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//create a popup that exists when the page is loaded
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

//create an alert when clicking on the map that displays the current lat long of the click
// function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }
// mymap.on('click', onMapClick);

//changes the alert to a popup for smoother capability
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);
console.log("Okay")

//creates lines that run along the listed lat long vertices
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40],[-105, 45],[-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40],[-110, 45],[-115, 55]]
}];

//creates a variable for style to be applied to the lines created
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
//adds the lines using the style created to the map
L.geoJSON(myLines, {
    style: myStyle
}).addTo(mymap);
console.log("Okay")

//creates a variable for states that are encapsulated by the polygons geometry provided
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22, 48.98],
            [-96.58, 45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type":"Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

//applies a style (color) to the polygons based on their properties
L.geoJSON(states, {
    style: function(feature) {
      switch (feature.properties.party) {
          case 'Republican': return {color: "#FF0000"};
          case 'Democrat': return {color: "#0000FF"};
      }
    }
}).addTo(mymap);
console.log("Okay")

//assigns properties to variable someGeojsonFeature (random place in Colorado)
var someGeojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "",
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-105, 39]
    }
};
//defines marker type and style
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    wight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
//displays stylized marker at latlong of called variable
L.geoJSON(someGeojsonFeature, {
    pointToLayer: function (someGeojsonFeature, latlng) {
        return L.circleMarker (latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);
console.log("Okay")

//creates function to show properties on popup
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}
//creates variable that stores geojsonfeature of coors field with corresponding properties and geometry
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//binds the popups to each feature before displaying it to the map
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(mymap);
console.log("Okay")

//creates some features with properity displaying true or false
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true

    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false

    },
    "geometry": {
        "type": "Point",
        "coordinates": [104.99404, 39.75621]

      }
}];
//applies features to map returning the logic of if they should show on the map
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);
console.log("Okay")
