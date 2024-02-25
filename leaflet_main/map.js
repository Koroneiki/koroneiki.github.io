
import './eventlisteners.js';
import './functions.js'

import { loadCountries } from './countries.js';
import { gameFunction } from './gamefunction.js';







var default_map_url = "";


// Initialisiere die Leaflet-Karte
export var map = L.map('map', {
    center: [51.1657, 10.4515], // Zentriere die Karte auf Deutschland
    zoom: 6, // Passe den initialen Zoom-Level bei Bedarf an
    maxBounds: [ // Definiere den maximalen Bereich der Karte
    [90, -220], // Southwest corner
    [-90, 220] // Northeast corner
    ],
    zoomControl: false,
    layers: [
        L.tileLayer(default_map_url, { 
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
    ]
});


    




//MAP-OPTIONS
function mapOptions (map) {

    addCustomZoomControl(map);

    function addCustomZoomControl(map) {
        // Erstelle eine neue Instanz der Zoom-Steuerung mit Optionen
        var zoomControl = L.control.zoom({
            position: 'bottomright' // Positioniere die Zoom-Steuerung unten rechts
        });

        
        zoomControl.addTo(map);
    }
}
mapOptions(map);



export var indexJSvalue = sessionStorage.getItem('selectedOption');
export var populationThreshold = sessionStorage.getItem('populationValue');
export var dropdownValue = sessionStorage.getItem('dropdownValue');




gameFunction();



loadCountries(map);






// Function to update the population threshold text
function updatePopulationThreshold(populationValue) {
    // Get reference to the span element
    const populationSpan = document.getElementById('population-value');
    
    // Update the text content of the span element with the population value
    populationSpan.textContent = Number(populationValue).toLocaleString();
}


const populationValue = populationThreshold; // Replace with the actual population value
updatePopulationThreshold(populationValue);




