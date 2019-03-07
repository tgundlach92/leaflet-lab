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
//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];
    console.log(attribute);
    //create marker options
    var options = {
        fillColor: "#003153",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);
    //build popup content string
    var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
    var year = attribute.split("yr_")[1];
    popupContent += "<p><b>Renewable Energy Production in " + year + ":</b> " + feature.properties[attribute] + " quadrillion BTU's</p>";
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};
//function to calculate the radius of the circles based on the attribute value
function calcPropRadius(attValue) {
    var scaleFactor = 50;
    var area = attValue * scaleFactor;
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};
function createSequenceControls(map, attributes){
    $('#panel').append('<input class="range-slider" type="range">');
    $('#panel').append('<button class="skip" id="reverse">Back</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/Reverse.png">');
    $('#forward').html('<img src="img/Forward.png">');

    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });

    //Step 5: click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();
        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };
        //update slider
        $('.range-slider').val(index);
        //input listener for slider
        $('.range-slider').on('input', function(){
            //sequence
        });
        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
};
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            var props = layer.feature.properties;
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";
            var year = attribute.split("yr_")[1];
            popupContent += "<p><b>Renewable Energy Production in " + year + ":</b> " + props[attribute] + " quadrillion BTU's</p>";
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
        };
    });
};
function processData(data){
    var attributes = [];
    var properties = data.features[0].properties;

    for (var attribute in properties){
        if (attribute.indexOf("yr_") > -1){
            attributes.push(attribute);
        };
    };
    console.log(attributes);
    return attributes;
};
function getData(map){
    $.ajax("data/RenewableEnergyProduction.geojson", {
        dataType: "json",
        success: function(response){

            var attributes = processData(response);
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
        }
    });
};

//engages the createMap when the document has finished loading
$(document).ready(createMap);
