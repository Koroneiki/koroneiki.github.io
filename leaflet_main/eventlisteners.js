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


// Define a function to handle radio button change events
function handleRadioButtonChange(event) {
    const radioValue = event.target.value;

    console.log('Radio button changed:', radioValue);

    // Define the map options
    const mapOptions = {
        'NoMap': null,
        'SatelliteMap': SatelliteMapLayer,
        'NoLabelsMap': NoLabelsLayer
    };

    // Check if the radio button is checked and its value is a valid option
    if (event.target.checked && mapOptions.hasOwnProperty(radioValue)) {
        console.log(`Selected: ${radioValue}`);

        // Set the appropriate tile layer based on the selected option
        setTileLayer(map, mapOptions[radioValue]);

        // Uncheck the other radio buttons if they're checked
        document.querySelectorAll(`input[name^="mapOption"]:checked`).forEach(radio => {
            if (radio.value !== radioValue) {
                radio.checked = false;
            }
        });
    }
}

// Attach event listeners to all radio buttons
document.querySelectorAll('input[name^="mapOption"]').forEach(radio => {
    radio.addEventListener('change', handleRadioButtonChange);
});



slider.addEventListener("input", function() {
    currentValue.textContent = `Current Scaling Factor: ${slider.value}`;
    // Update the circle radius based on the new scaling factor
    updateCircleRadius(map, parseFloat(slider.value)); // Convert slider value to a float
});



