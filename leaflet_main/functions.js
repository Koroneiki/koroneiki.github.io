import {loadCities, getRadiusFromPopulation} from './cities.js';
import { indexJSvalue } from './map.js';
import {populationThreshold} from './map.js';
import { ApiURLConstructor } from './apiconstructor.js';
import { getCityStatistics } from './gamefunction.js';







export async function searchCity(map) {
    return new Promise(async (resolve, reject) => {
        const input = document.getElementById('input')
        const cityName = input.value;

        const apiUrl = ApiURLConstructor(indexJSvalue, populationThreshold, cityName, getCityStatistics());

        console.log(cityName);
        console.log(apiUrl);

        // Use await to wait for loadCities to complete
        loadCities(map, apiUrl, function (success) {
            if (success) {
                input.value = "";
                resolve();
            } else {
                
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





export async function fetchCountryData() {

    const apiUrl = 'https://restcountries.com/v3.1/all';
    const excludedCca3Codes = ['UNK', 'PSE'];

    try {
        // Start the timer
        const startTime = performance.now();
        
        // Fetch data from the API
        const response = await fetch(apiUrl);
        
        // If response is not okay, throw an error
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        // Parse the JSON response
        let data = await response.json();

        // Filter out entries where independent is not true
        data = data.filter(country => country.independent === true || excludedCca3Codes.includes(country.cca3));
        

        
        // Stop the timer
        const endTime = performance.now();
        
        // Calculate the response time
        const responseTime = endTime - startTime;
        console.log('Response time (ms):', responseTime);

        console.log(data);

        const subregions = [...new Set(data.map(country => country.subregion))];

        // Log the available subregions
        console.log('Available Subregions:', subregions);


        
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
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



