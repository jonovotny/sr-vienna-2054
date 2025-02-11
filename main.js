import './style.scss';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj.js';
import {Select} from 'ol/interaction.js';
import * as olExtent from 'ol/extent';
import VectorLayer from 'ol/layer/Vector';
import {get} from 'ol/proj.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Fill, Stroke, Text, Style} from 'ol/style';
import {featureCollection, difference, union } from '@turf/turf';
import LayerGroup from 'ol/layer/Group.js';
import ol_style_FillPattern from 'ol-ext/style/FillPattern';
import ol_control_LayerSwitcher from 'ol-ext/control/LayerSwitcher';
//import ol_control_EditBar from "ol-ext/control/EditBar";
import ol_control_Toggle from 'ol-ext/control/Toggle';
import ol_overlay_Popup from 'ol-ext/overlay/popup';

const raster = new TileLayer({
  source: new OSM(),
  className: 'ol_bw',
  displayInLayerSwitcher: false,
});

var settings = {
  "mapPath": "https://raw.githubusercontent.com/jonovotny/sr-vienna-2054/refs/heads/main/maps/SR-Vienna-2054.geojson",
  "language": "en",
  "showSource": true,
  "showComment": false,
}

var markerSymbols = {
  "gang/Strizzies": "\u{f508}",
  "gang/Erich": "\u{f227}",
  "shop/rigger": "\u{f544}",
  "shop/explosives": "\u{f1e2}",
  "shop/magic": "\u{e2ca}",
  "shop/weapons": "\u{e19b}",
  "service/clinic": "\u{f0f8}",
  "service/first aid": "\u{f479}",
  "service/repair": "\u{f7d9}",
  "service/restaurant": "\u{f2e7}",
  "service/bar": "\u{f57b}",
  "service/black market": "\u{f21b}",
  "service/cafe": "\u{f0f4}",
  "service/golf": "\u{f450}",
  "service/security": "\u{e4d8}",
  "service/place of power": "\u{e05d}",
  "road/blockade": "\u{e562}",
  "road/tunnel entrance": "\u{e4de}",
  "road/checkpoint": "\u{e54a}",
  "road/ferry": "\u{e4ea}",
  "default": ""
};


var colorLib = {
  "security/AAA": '#3288bd',
  "security/AA": '#66c2a5',
  "security/A": '#abdda4',
  "security/B": '#e6f598',
  "security/C": '#fee08b',
  "security/D": '#fdae61',
  "security/E": '#f46d43',
  "security/Z": '#d53e4f',
  "road/highway/inner": '#73545a',
  "road/highway/outer": '#8f8181',
  "district/LightBlue": '#a6cee3',
  "district/DarkBlue": '#1f78b4',
  "district/LightGreen": '#b2df8a',
  "district/DarkGreen": '#33a02c',
  "neighborhood/residential": '#a6cee3',
  "neighborhood/park": '#4daf4a',
  "neighborhood/cemetary": '#984ea3',
  "neighborhood/golf": '#4daf4a',
  "neighborhood/corp": '#ffff99',
  "gang/Strizzis": '#e41a1c',
  "gang/Erich": '#ff8da1',
  "gang/L": '#ff7f00',
  "gang/Hafenbrüder": '#377eb8',
  "gang/Anarchists": '#000000',
  "gang/Mafia": '#8dd3c7',
  "gang/Seoulpa": '#bebada',
  "gang/Triads": '#ffffb3',
  "gang/Yakuza": '#fb8072',
  "border/state/2054": '#C19A6B',
  "border/state/2080": '#C19A6B',
  "selected": "#0cbe3c"
}

var textStyles = {
  "security/AAA": new Text({
    fill: new Fill({color: colorLib["security/AAA"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/AA": new Text({
    fill: new Fill({color: colorLib["security/AA"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/A": new Text({
    fill: new Fill({color: colorLib["security/A"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/B": new Text({
    fill: new Fill({color: colorLib["security/B"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/C": new Text({
    fill: new Fill({color: colorLib["security/C"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/D": new Text({
    fill: new Fill({color: colorLib["security/D"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/E": new Text({
    fill: new Fill({color: colorLib["security/E"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "security/Z": new Text({
    fill: new Fill({color: colorLib["security/Z"]}),
    stroke: new Stroke({color: 'black', width: 2}),
    font: '20px Tahoma'}),
  "road/highway tunnel": new Text({
    fill: new Fill({color: 'white'}),
    stroke: new Stroke({color: 'black', width: 0.3}),
    placement: 'line',
    font: '10px Tahoma'}),
  "road/street": new Text({
    fill: new Fill({color: 'white'}),
    stroke: new Stroke({color: 'black', width: 0.3}),
    placement: 'line',
    font: '10px Tahoma'}),
  "building/*": new Text({
    fill: new Fill({color: 'white'}),
    stroke: new Stroke({color: 'black', width: 0.3}),
    placement: 'line',
    textBaseline: 'hanging',
    font: '10px Tahoma'}),
  "district/*": new Text({
    fill: new Fill({color: 'white'}),
    stroke: new Stroke({color: 'black', width: 0.3}),
    font: '18px Tahoma'}),
  "neighborhood/*": new Text({
    fill: new Fill({color: 'white'}),
    stroke: new Stroke({color: 'black', width: 0.3}),
    font: '14px Tahoma'}),
  "gang/*": new Text({
    fill: new Fill({color: 'white'}),
    stroke: new Stroke({color: 'black', width: 0.3}),
    font: '14px Tahoma'}),
  "border/*": new Text({}),
  "selected": new Text({
    fill: new Fill({color: 'black'}),
    stroke: new Stroke({color: colorLib['selected'], width: 3}),
    font: '900 16px "Font Awesome 6 Free"'}),
  "default": new Text({
    fill: new Fill({color: 'black'}),
    stroke: new Stroke({color: 'white', width: 3}),
    font: '900 16px "Font Awesome 6 Free"'})
};

var fillStyles = {
  "security/AAA": new Fill({color: colorLib["security/AAA"] + '66'}),
  "security/AA": new Fill({color: colorLib["security/AA"] + '66'}),
  "security/A": new Fill({color: colorLib["security/A"] + '66'}),
  "security/B": new Fill({color: colorLib["security/B"] + '66'}),
  "security/C": new Fill({color: colorLib["security/C"] + '66'}),
  "security/D": new Fill({color: colorLib["security/D"] + '66'}),
  "security/E": new Fill({color: colorLib["security/E"] + '66'}),
  "security/Z": new ol_style_FillPattern({
    pattern: "hatch",
    size: 1,
    spacing: 10,
    angle: 60,
    color: colorLib["security/Z"],
    background: 'rgba(0,0,0,0)'
  }),
  "district/Transdanubien": new Fill({color: colorLib["district/DarkBlue"] + '55'}),
  "district/Vorstadt": new Fill({color: colorLib["district/DarkBlue"] + '55'}),
  "district/Vereinigte Wohnparks": new Fill({color: colorLib["district/DarkBlue"] + '55'}),
  "district/Schwechat": new Fill({color: colorLib["district/DarkBlue"] + '55'}),
  "district/Groß-Enzersdorf": new Fill({color: colorLib["district/DarkGreen"] + '55'}),
  "district/Industriezone Laa": new Fill({color: colorLib["district/DarkGreen"] + '55'}),
  "district/Brigittenau": new Fill({color: colorLib["district/DarkGreen"] + '55'}),
  "district/Neo-Ottakring": new Fill({color: colorLib["district/DarkGreen"] + '55'}),
  "district/Innere Stadt Kon": new Fill({color: colorLib["district/LightGreen"] + '55'}),
  "district/Donaufreizone": new Fill({color: colorLib["district/LightGreen"] + '55'}),
  "district/Wien West": new Fill({color: colorLib["district/LightGreen"] + '55'}),
  "district/Groß-Döbling": new Fill({color: colorLib["district/LightGreen"] + '55'}),
  "building/*": new Fill({color: '#302d2b'}),
  "neighborhood/residential": new Fill({color: colorLib["neighborhood/residential"] + '55'}),
  "neighborhood/park": new Fill({color: colorLib["neighborhood/park"] + '55'}),
  "neighborhood/cemetary": new Fill({color: colorLib["neighborhood/cemetary"] + '55'}),
  "neighborhood/golf": new Fill({color: colorLib["neighborhood/golf"] + '55'}),
  "neighborhood/corp": new Fill({color: colorLib["neighborhood/corp"] + '55'}),
  "gang/Strizzis": new Fill({color: colorLib["gang/Strizzis"] + '55'}),
  "gang/L": new Fill({color: colorLib["gang/L"] + '55'}),
  "gang/Hafenbrüder": new Fill({color: colorLib["gang/Hafenbrüder"] + '55'}),
  "gang/Anarchists": new Fill({color: colorLib["gang/Anarchists"] + '55'}),
  "gang/Mafia": new Fill({color: colorLib["gang/Mafia"] + '55'}),
  "gang/Seoulpa": new Fill({color: colorLib["gang/Seoulpa"] + '55'}),
  "gang/Triads": new Fill({color: colorLib["gang/Triads"] + '55'}),
  "gang/Yakuza": new Fill({color: colorLib["gang/Yakuza"] + '55'}),
  "selected": new Fill({color: colorLib['selected'] + 99}),
  "default": new Fill({color: 'rgba(0,0,0,0)'})
};

var strokeStyles = {
  "security/AAA": new Stroke({color: colorLib["security/AAA"]}),
  "security/AA": new Stroke({color: colorLib["security/AA"]}),
  "security/A": new Stroke({color: colorLib["security/A"]}),
  "security/B": new Stroke({color: colorLib["security/B"]}),
  "security/C": new Stroke({color: colorLib["security/C"]}),
  "security/D": new Stroke({color: colorLib["security/D"]}),
  "security/E": new Stroke({color: colorLib["security/E"]}),
  "security/Z": new Stroke({color: colorLib["security/Z"]}),
  "road/highway/inner": new Stroke({color: colorLib["road/highway/inner"], width: 6}),
  "road/highway/outer": new Stroke({color: colorLib["road/highway/outer"], width: 8}),
  "road/highway tunnel/inner": new Stroke({color: colorLib["road/highway/inner"], width: 6}),
  "road/highway tunnel/outer": new Stroke({color: colorLib["road/highway/outer"], width: 8, lineDash: [4, 10]}),
  "road/street/inner": new Stroke({color: 'black', width: 5}),
  "road/street/outer": new Stroke({color: '#cccccc', width: 5.5}),
  "district/*": new Stroke({color: '#cccccc', width: 2}),
  "building/*": new Stroke({color: '#3e3b38', width: 2}),
  "border/state/2054": new Stroke({color: colorLib["border/state/2080"]+'88', width: 6}),
  "border/state/2080": new Stroke({color: colorLib["border/state/2080"]+'88', width: 6, lineDash: [3, 8]}),
  "selected": new Stroke({color: colorLib['selected'], width: 6}),
  "default": new Stroke({color: 'white', width: 3})
};

var styleLib = {
  "none": new Style({}),
  "road/highway": [new Style({stroke: strokeStyles["road/highway/outer"], zIndex: 6}), new Style({stroke: strokeStyles["road/highway/inner"], zIndex: 7})],
  "road/highway tunnel": [new Style({stroke: strokeStyles["road/highway tunnel/outer"], zIndex: 6}), new Style({stroke: strokeStyles["road/highway tunnel/inner"], text: textStyles["road/highway tunnel"], zIndex: 7})],
  "road/street": [new Style({stroke: strokeStyles["road/street/outer"], zIndex: 6}), new Style({stroke: strokeStyles["road/street/inner"], text: textStyles["road/street"], zIndex: 7})],
};

const securityOrder= ["A", "D", "C", "B", "AA", "AAA", "E", "Z"];


/**
 * Returns a geojson object containing non-overlapping features for each security zone from an original vector source. 
 * Only features with a "security" property are considered. 
 * If an overlap occurs, it is removed from the underlying feature based on the security order.
 *
 * @param {Object} source The original vector feature layer.
 * @param {string[]} order The order in which overlaps are handled.
 * @return {Object} A vector source with non-overlapping security area features.
 */
function createSecurityZones(source, order) {
  var secAreas = [];
  var newAreas = [];

  for (var secRating of order) {
    var newAreas = [];
    for (var feature of source.features) {
      if (feature.properties["security"] == secRating) {
        feature.properties.name = `Security ${secRating} (${feature.properties.name})`;
        feature.properties.type = "security";
        if (feature.properties.securityDetails) {
          feature.properties.details = feature.properties.securityDetails;
        }
        feature.properties.spec = secRating;
        for (var area of secAreas.values()) {
          var diff = diffFeature(area, feature);
          area.type = diff.type;
          area.geometry = diff.geometry;
        }
        newAreas.push(feature);
      }
    }
    if (newAreas.length > 0) {
      newAreas.map((x) => secAreas.push(x));
    }
  }
  return featureCollection(secAreas);
}


/**
 * Subtracts the area of feature b from feature a and returns the changed feature.
 *
 * @param {Feature} a 
 * @param {Feature} b 
 * @return {Feature} 
 */
function diffFeature(a, b) {
  var coll = featureCollection([a,b]);
  return difference(coll);
}

var secZone = JSON.stringify(featureCollection([]));
var secAreas = {};

const securitySource = new VectorSource({
//  url: 'data:,'+ encodeURIComponent(secZone),
  format: new GeoJSON(),
});

var features;

fetch(settings['mapPath'])
    .then((response) => secAreas = response.json())
    .then((json) => secZone = createSecurityZones(json, securityOrder))
    .then((x) => features = new GeoJSON().readFeatures(secZone, {featureProjection: 'EPSG:3857'}))
    .then((x) => securitySource.addFeatures(features))
    //.then((json) => secZone = JSON.stringify(createSecurityZones(json, securityOrder)))
    //.then((x) => securitySource.setUrl('data:,'+ encodeURIComponent(secZone)))
    //.then((x) => securitySource.refresh())



function fetchStyle(key) {
  var parentkey = key.substring(0, key.indexOf("/")) + "/*";
  if (styleLib[key]) {
    return styleLib[key];
  } else {
    var textStyle = textStyles["default"];
    if (textStyles[key]) {
      textStyle = textStyles[key];
    } else if (textStyles[parentkey]) {
      textStyle = textStyles[parentkey];
    }
    var strokeStyle = strokeStyles["default"];
    if (strokeStyles[key]) {
      strokeStyle = strokeStyles[key];
    } else if (strokeStyles[parentkey]) {
      strokeStyle = strokeStyles[parentkey];
    }
    var fillStyle = fillStyles["default"];
    if (fillStyles[key]) {
      fillStyle = fillStyles[key];
    } else if (fillStyles[parentkey]) {
      fillStyle = fillStyles[parentkey];
    }
    var style = new Style({
      text: textStyle,
      stroke: strokeStyle,
      fill: fillStyle
    });
    styleLib[key] = style;
    return style;
  }
}

const securityLayer = new VectorLayer({
  source: securitySource,
  visible: false,
  title: "Security Ratings",
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get('security');

    var baseStyle = fetchStyle(type+"/"+spec);
    if (Array.isArray(baseStyle)) {
      baseStyle.at(-1).getText().setText(label);
    } else {
      baseStyle.getText().setText(label);
    }

    if(feature.getGeometry().getType() == "Point") {
      var symbol = type+"/"+spec;
      if (markerSymbols[type+"/"+spec]) {
        symbol = markerSymbols[type+"/"+spec];
      }
      baseStyle.getText().setText(symbol);
    }
    return baseStyle;
  },
});

function populateFeatureSources() {
  
  infraShapeSource.clear();
  infraMarkerSource.clear();
  districtSource.clear();
  neighborhoodSource.clear();
  poiSource.clear();

  for (var feature of baseSource.getFeatures()) {
    if(feature.getGeometry().getType() == "Point") {
      if (feature.get("type") == "road") {
        infraMarkerSource.addFeature(feature.clone());
      } else {
        poiSource.addFeature(feature.clone());
      }
    } else {
      if (feature.get("type") == "road" || feature.get("type") == "building") {
        infraShapeSource.addFeature(feature.clone());
      } else if (feature.get("type") == "district") {
        districtSource.addFeature(feature.clone());
      } else if (feature.get("type") == "border") {
        borderSource.addFeature(feature.clone());
      } else {
        neighborhoodSource.addFeature(feature.clone());
      }
    }
  }
  //viewing the baseLayer forces openlayers to load its
  baseLayer.setVisible(false);
}

const infraShapeSource = new VectorSource({});
const infraMarkerSource = new VectorSource({});
const districtSource = new VectorSource({});
const neighborhoodSource = new VectorSource({});
const poiSource = new VectorSource({});
const borderSource = new VectorSource({});

var baseSource = new VectorSource({
  url: 'settings["mapPath"]',
  format: new GeoJSON(),
});

baseSource.on("featuresloadend", function () {
  populateFeatureSources();
});

const baseLayer = new VectorLayer({
  source: baseSource,
  displayInLayerSwitcher: false,
});


baseLayer.setVisible(true);
baseSource.setUrl(settings["mapPath"]);

const infrastructureLayer = new VectorLayer({
  source: infraShapeSource,
  displayInLayerSwitcher: false,
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");

    var baseStyle = fetchStyle(type+"/"+spec);
    if (Array.isArray(baseStyle)) {
      if (baseStyle.at(-1).getText()) {
        baseStyle.at(-1).getText().setText(label);
      }
    } else {
      baseStyle.getText().setText(label);
    }

    return baseStyle;
  },
});

const infrastructureMarkers = new VectorLayer({
  source: infraMarkerSource,
  displayInLayerSwitcher: false,
  minZoom: 12,
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");

    var baseStyle = fetchStyle("default");

    if(feature.getGeometry().getType() == "Point") {
      var symbol = type+"/"+spec;
      if (markerSymbols[type+"/"+spec]) {
        symbol = markerSymbols[type+"/"+spec];
      }
      baseStyle.getText().setText(symbol);
      baseStyle.setZIndex(10);
    }
    return baseStyle;
  },
});


const districtLayer = new VectorLayer({
  source: districtSource,
  title: "Districts",
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");

    var baseStyle = fetchStyle(type+"/"+label);

    baseStyle.getText().setText(label);

    return baseStyle;
  },
});

const neighborhoodLayer = new VectorLayer({
  source: neighborhoodSource,
  title: "Neigborhoods/Regions",
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");

    var baseStyle = fetchStyle(type+"/"+spec);

    baseStyle.getText().setText(label);
    if (spec == "golf") {
      baseStyle.setZIndex(1);
    }

    return baseStyle;
  },
});

const poiLayer = new VectorLayer({
  source: poiSource,
  title: "Points of Interest",
  minZoom: 12,
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");

    var baseStyle = fetchStyle("default");

    var symbol = type+"/"+spec;
    if (markerSymbols[type+"/"+spec]) {
      symbol = markerSymbols[type+"/"+spec];
    }
    baseStyle.getText().setText(symbol);
    baseStyle.setZIndex(14);

    return baseStyle;
  },
});

const border2054Layer = new VectorLayer({
  source: borderSource,
  title: "Vienna 2054",
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");
    if (spec != "state/2054") {
      return fetchStyle('none');
    }

    var baseStyle = fetchStyle(type+"/"+spec);

    return baseStyle;
  },
});

const border2080Layer = new VectorLayer({
  source: borderSource,
  title: "Vienna 2080",
  visible: false,
  style: function(feature, resolution){
    var type = feature.get("type");
    var spec = feature.get("spec");
    var label = feature.get("name");
    if (spec != "state/2080") {
      return fetchStyle('none');
    }

    var baseStyle = fetchStyle(type+"/"+spec);

    return baseStyle;
  },
});

const borderGroup = new LayerGroup({
  title: 'State borders',
  layers: [border2054Layer, border2080Layer],
});



// Limit multi-world panning to one world east and west of the real world.
// Geometry coordinates have to be within that range.
const extent = get('EPSG:3857').getExtent().slice();
extent[0] += extent[0];
extent[2] += extent[2];
const map = new Map({
  layers: [raster, infrastructureLayer, borderGroup, districtLayer, neighborhoodLayer, poiLayer, securityLayer, infrastructureMarkers, baseLayer],
  target: 'map',
  view: new View({
    center: fromLonLat([16.37208, 48.20849]),
    projection: 'EPSG:3857',
    zoom: 11,
    extent,
  }),
});

var ctrl = new ol_control_LayerSwitcher({
  // collapsed: false,
  // mouseover: true
});
map.addControl(ctrl);

// Popup overlay
var popup = new ol_overlay_Popup ({
  popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
  closeBox: true,
  positioning: 'auto',
  autoPan: {
    animation: { duration: 250 }
  }
});
map.addOverlay(popup);

function selectStyle(feature) {
  var selectedStyle = fetchStyle('selected');
  selectedStyle.getText().setText("");
  if (feature.getGeometry().getType() == 'Point') {
    var marker = markerSymbols[feature.getProperties()["type"] + "/" + feature.getProperties()["spec"]];
    if (marker) {
      selectedStyle.getText().setText(marker);
    } 
  }
  return selectedStyle;
}

// Control Select 
var select = new Select({
  layers: [districtLayer, neighborhoodLayer, poiLayer, securityLayer, infrastructureMarkers],
  style: selectStyle
});
map.addInteraction(select);

function createPopupContent(feature) {
  var content = "";
  content += '<span style=\"font-weight: bold;\">' + feature.getProperties()["name"] + "</span><br/>";
  if (feature.getProperties()["details"]) {
    content += "<p>"+feature.getProperties()["details"][settings["language"]]+"</p>";
  }
  if (settings["showComment"]){
    if (feature.getProperties()["comment"]) {
      content += '<p style="font-size: 12px;font-style:italic">&gt;&gt;&gt;[' + feature.getProperties()["comment"] + ']&lt;&lt;&lt;<br/> - Domokun [01:08:32/02-08-2054]</p>';
    } else {
      content += '<p style="font-size: 12px;font-style:italic">&gt;&gt;&gt;[Got no comment on this, chummer.]&lt;&lt;&lt;<br/> - Domokun [01:08:32/02-08-2054]</p>';
    }
  }
  if (settings["showSource"]){
    if (feature.getProperties()["source"]) {
      content += '<span style="font-size: 10px;">' + feature.getProperties()["source"] + "</span>";
    } else {
      content += '<span style="font-size: 10px;">no source</span>';
    }
  }
  return content;
}

var popupSelect = null;

  // On selected => show/hide popup
select.getFeatures().on(['add'], function(e) {
  var feature = e.element;
  popupSelect = feature;
  var content = createPopupContent(feature);
 
  var popupLoc = olExtent.getCenter(feature.getGeometry().getExtent());
  if (!feature.getGeometry().intersectsCoordinate(popupLoc)) {
    popupLoc = feature.getGeometry().getClosestPoint(popupLoc);
  }
  popup.show(popupLoc, content); 
});

select.getFeatures().on(['remove'], function(e) {
  popup.hide(); 
})


var languageCtrl = new ol_control_Toggle({
  className: "toggle toggle-lang",
  title: "Toggle Language",
  active: true,
  onToggle: function(active) {
    if(active){
      settings["language"] = "en";
    } else {
      settings["language"] = "de";
    }
    if (popup.getVisible()) {
      popup.show(createPopupContent(popupSelect));
    }
  }
});
map.addControl(languageCtrl);

var sourceCtrl = new ol_control_Toggle({
  html: '<i class="fa-solid fa-book-bookmark"></i>',
  className: "toggle toggle-source",
  title: "Show Data Source",
  active: true,
  onToggle: function(active) {
    if(active){
      settings["showSource"] = true;
    } else {
      settings["showSource"] = false;
    }
    if (popup.getVisible()) {
      popup.show(createPopupContent(popupSelect));
    }
  }
});
map.addControl(sourceCtrl);

var commentCtrl = new ol_control_Toggle({
  html: '<i class="fa-solid fa-comment-dots"></i>',
  className: "toggle toggle-comment",
  title: "Show Creator Comments",
  active: false,
  onToggle: function(active) {
    if(active){
      settings["showComment"] = true;
    } else {
      settings["showComment"] = false;
    }
    if (popup.getVisible()) {
      popup.show(createPopupContent(popupSelect));
    }
  }
});
map.addControl(commentCtrl);
