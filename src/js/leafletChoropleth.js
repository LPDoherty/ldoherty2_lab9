////////////////////////////////////////////////////////////////////////////////
// initialize the map
var coords = [37.8, -96]; // map center point
var zoom = 5; // map zoom level lower number is out higher number is in
var map = L.map('map').setView(coords, zoom); // put it all together

////////////////////////////////////////////////////////////////////////////////
// load a basemap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

////////////////////////////////////////////////////////////////////////////////
// control that shows state info on hover
var info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function(props) {
  this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
    '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>' :
    'Hover over a state');
};

info.addTo(map);

////////////////////////////////////////////////////////////////////////////////
// get color depending on population density value
function getColor("Total Population") {
  return "Total Population" = 0 ? '#800026' :
    "Total Population" > 100000 ? '#BD0026' :
    "Total Population" > 50000 ? '#E31A1C' :
    "Total Population" > 100 ? '#FC4E2A' :
    "Total Population" > 50 ? '#FD8D3C' :
    "Total Population" > 20 ? '#FEB24C' :
    "Total Population" > 10 ? '#FED976' :
    '#FFEDA0';
}
// set color of the json based on its Population Density
function style(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties.TotalPopulation)
  };
}
// highlightFeature function
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

var geojson;
// reset previously highlighted feature function
function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}
// zoom to feature function
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}
// tie functions to DOM events like onClick etc.
function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}
// specify the functions will execute on statesData
geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(map);

////////////////////////////////////////////////////////////////////////////////
// customize map attribution in lower left corner
map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

////////////////////////////////////////////////////////////////////////////////
// add legend layer to map at the given position
var legend = L.control({
  position: 'bottomright'
});
// populate legend with provided data referencing color of statesData at break points
legend.onAdd = function(map) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [],
    from, to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];

    labels.push(
      '<i style="background:' + getColor(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};
// add legend to map
legend.addTo(map);
