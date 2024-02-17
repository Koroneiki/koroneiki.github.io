import {loadCities, getRadiusFromPopulation} from './cities.js';
import { indexJSvalue } from './map.js';
import { ApiURLConstructor } from './apiconstructor.js';

export function searchCity(map) {
    return new Promise((resolve, reject) => {
        const input = document.getElementById('input')
        const cityName = input.value;

        const apiUrl = ApiURLConstructor(indexJSvalue, cityName);

        console.log(cityName);
        console.log(apiUrl);
        loadCities(map, apiUrl, function(success) {
            if (success) {
                input.value = "";
                resolve();
            } else if (!success) {
                resolve();
            }
        });
    });
}


export function handleInputChange() {
    console.log('Input value changed');
}


export function setTileLayer(map, layer) {
    
    console.log('Setting tile layer:', layer);
    map.eachLayer(function (currentLayer) {
        if (currentLayer instanceof L.TileLayer) {
            console.log('Removing layer:', currentLayer);
            map.removeLayer(currentLayer); // Remove basemap layers
        }
    });
    if (layer) {
        console.log('Adding new layer:', layer);
        layer.addTo(map); // Add new layer if provided
        layer.bringToBack();
    }
}
    

export function updateCircleRadius(map, scalingFactor) {
    // Loop through each circle marker and update its radius
    map.eachLayer(function(layer) {
        if (layer instanceof L.Circle) {
            layer.setRadius(getRadiusFromPopulation(layer.options.population, scalingFactor));
        }
    });
}