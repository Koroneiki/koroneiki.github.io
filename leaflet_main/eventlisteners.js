import {map} from './map.js';
import { searchCity, handleInputChange, setTileLayer, updateCircleRadius } from './functions.js';

const input = document.getElementById('input');
const search_button = document.getElementById('search_button');

const slider = document.getElementById("scaling-slider");
const currentValue = document.getElementById("current-value");

var SatelliteMapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var NoLabelsLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


input.addEventListener('keypress', function(event) {
    // Check if the pressed key is the Enter key (key code 13)
    if (event.keyCode === 13) {
        
        searchCity(map);
    }
});


search_button.addEventListener('click', function() {
    
    searchCity(map);
});


input.addEventListener('input', function() {
    
    handleInputChange();
});


document.querySelectorAll('input[name="mapOption1"], input[name="mapOption2"], input[name="mapOption3"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        console.log('Radio button changed:', this.value);
        if (this.checked) {
            if (this.value === 'NoMap') {
                console.log('Selected: No Map');
                setTileLayer(map, null); // Remove the basemap layer
                // Uncheck the other radio buttons if they're checked
                document.querySelector('input[name="mapOption2"][value="SatelliteMap"]').checked = false;
                document.querySelector('input[name="mapOption3"][value="NoLabelsMap"]').checked = false;
            } else if (this.value === 'SatelliteMap') {
                console.log('Selected: Satellite Map');
                setTileLayer(map, SatelliteMapLayer); // Set the satellite map layer
                // Uncheck the other radio buttons if they're checked
                document.querySelector('input[name="mapOption1"][value="NoMap"]').checked = false;
                document.querySelector('input[name="mapOption3"][value="NoLabelsMap"]').checked = false;
            } else if (this.value === 'NoLabelsMap') {
                console.log('Selected: Base Map');
                setTileLayer(map, NoLabelsLayer)
                // Uncheck the other radio buttons if they're checked
                document.querySelector('input[name="mapOption1"][value="NoMap"]').checked = false;
                document.querySelector('input[name="mapOption2"][value="SatelliteMap"]').checked = false;
            }
        }
    });
});


slider.addEventListener("input", function() {
    currentValue.textContent = `Current Scaling Factor: ${slider.value}`;
    // Update the circle radius based on the new scaling factor
    updateCircleRadius(map, parseFloat(slider.value)); // Convert slider value to a float
});
