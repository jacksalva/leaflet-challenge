var apiKey = "pk.eyJ1IjoiamFja3NhbHZhIiwiYSI6ImNrOXpyZDJ3ZTB5a3czZXF1MjZxcTl3aG8ifQ.BnqnVj8yn2zTZf0-iqgUTg";

//create map
var map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 12
});

//baselayer
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 7,
  id: "mapbox.light",
  accessToken: apiKey
}).addTo(map);

//link to data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//function to return color based on magnitude
function chooseColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#40027E";
    case magnitude > 4:
      return "#011392";
    case magnitude > 3:
      return "#017EA7";
    case magnitude > 2:
      return "#01BB74";
    case magnitude > 1:
      return "#03D000";
    default:
      return "#92E500";
    }
}

//function to return radius based on magnitude
function chooseRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
}

//function for feature styling
function styling(feature){
    return {
        color: "black",
        fillColor: chooseColor(feature.properties.mag),
        radius: chooseRadius(feature.properties.mag),
        fillOpacity: 0.75,
        opacity: 0.75,
        weight: 1,
        stroke: true
    };
}

//Perform an API call to the Earthquake Information endpoint
d3.json(link, function(data) {

    //create geoJSON layer
    L.geoJSON(data, {

        //style each feature
        style: styling,

        //add circle marker layer for each feature
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        //create pop-up for info display
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          }
    }).addTo(map);


    //create info ledgend
    var info = L.control({
        position: "bottomright"
    });

    //add details then add info legend to map
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        
        var magnitude = [0,1,2,3,4,5];
        var colors = [
            "#92E500",
            "#03D000",
            "#01BB74",
            "#017EA7",
            "#011392",
            "#40027E"
        ];

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
              "<i style='background: " + colors[i] + "'></i> " +
              magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
          }
        return div;
    };
    info.addTo(map);
});
