import {loadCities, getRadiusFromPopulation} from './cities.js';
import { indexJSvalue } from './map.js';
import { renderChatMessage } from './chat.js';
import { ApiURLConstructor } from './apiconstructor.js';
import { fetchCountryData } from './data.js';


// Function to convert string to title case
export function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}




export async function searchCity(map) {
    return new Promise(async (resolve, reject) => {
        try {
            const input = document.getElementById('input');
            const cityName = input.value.trim(); // Trim whitespace from input

            if (!cityName) {
                throw new Error('Please enter a city name.'); // Validate input
            }

            const apiUrl = await ApiURLConstructor(indexJSvalue, cityName);

            console.log(cityName);
            console.log(apiUrl);

            // Use await to wait for loadCities to complete
            loadCities(map, apiUrl, function (success) {
                if (success) {
                    renderChatMessage();
                    input.value = ""; // Clear input after successful search
                    resolve();
                } else {
                    shakeInputElement(); // Animate input element on failure
                    resolve();
                }
            });
        } catch (error) {
            console.error('Error searching for city:', error.message);
            reject(error); // Reject promise with error
        }
    });
}



function shakeInputElement() {
    const input = document.getElementById('input');
    input.classList.add('shake_input');
    
    // Remove the 'shake_input' class after the animation duration to allow for subsequent shakes
    setTimeout(() => {
        input.classList.remove('shake_input');
    }, 500); // Adjust the duration as needed
}



export function handleInputChange() {
    console.log('Input value changed');
}


export function setTileLayer(map, layer) {
    console.log('Setting tile layer:', layer);

    // Remove existing tile layers from the map
    map.eachLayer(function (currentLayer) {
        if (currentLayer instanceof L.TileLayer) {
            console.log('Removing layer:', currentLayer);
            map.removeLayer(currentLayer);
        }
    });

    // Add the new tile layer to the map if provided
    if (layer) {
        console.log('Adding new layer:', layer);
        layer.addTo(map);
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






// Function to extract country name, cca2, and cca3 codes from the provided API data
export async function getCcaCodes() {
    const data = await fetchCountryData();
    
    if (!data) {
        console.error('No data available');
        return [];
    }
    
    // Extract country name, cca2, and cca3 codes from the data
    const codes = data.map(country => ({ name: country.name.common, cca2: country.cca2, cca3: country.cca3 }));
    
    console.log('Codes:', codes);
    
    return codes;
}



