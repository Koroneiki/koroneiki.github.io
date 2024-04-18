import { fetchCountryData, fetchNaturalEarthData } from './data.js';
import { continent, countryIsoA3 } from './gamefunction.js';

// Function to filter countries based on continent or countryIsoA3
function filterCountries(countriesData, continent, countryIsoA3) {
    if (continent) {
        // Filter countries based on whether the specified continent is included in the "continents" property
        return countriesData.filter(country => country.continents.includes(continent));
    } else if (countryIsoA3) {
        // Filter countries based on the specified ISO A3 code
        return countriesData.filter(country => country.cca3 === countryIsoA3);
    } else {
        // If neither continent nor country is specified, return all countries
        return countriesData;
    }
}

// Function to fetch and load countries data
export async function loadCountries(map) {
    const countriesData = await fetchCountryData();

    // Filter countries based on continent or countryIsoA3
    const filteredCountries = filterCountries(countriesData, continent, countryIsoA3);

    // Extract cca3 codes of countries from the filtered countries data
    const cca3Codes = filteredCountries.map(country => country.cca3);
    const cca2Codes = filteredCountries.map(country => country.cca2);

    setCca2Codes(cca2Codes);

    // Fetch Natural Earth data
    const data = await fetchNaturalEarthData();

    // Filter GeoJSON data based on cca3Codes
    const filteredFeatures = data.features.filter(feature => {
        return cca3Codes.includes(feature.properties.ISO_A3) || cca3Codes.includes(feature.properties.ADM0_A3);
    });

    // Add filtered features to map
    filteredFeatures.forEach(feature => {
        const geojsonLayer = L.geoJSON(feature).addTo(map);
        geojsonLayer.bringToBack();
        geojsonLayer.setStyle({ weight: 1 });

        geojsonLayer.eachLayer(layer => {
            layer.on('click', function (event) {
                const featureProperties = event.target.feature.properties;
                const adminDivisionName = featureProperties.NAME;
                console.log("Clicked on:", adminDivisionName);
                layer.setStyle({ color: "orange", weight: 2 });
            });
        });
    });
}



// Function to set cca2 codes
let cca2Codes;
export function setCca2Codes(value) {
    cca2Codes = value;
}

// Function to get cca2 codes
export function getCca2Codes() {
    return cca2Codes;
}
