

import { fetchCountryData } from './functions.js';
import { continent, countryIsoA3 } from './gamefunction.js';


export async function fetchNaturalEarthData() {
    const geojsonURL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries_deu.geojson";
    const url = 'https://corsproxy.io/?' + encodeURIComponent(geojsonURL);
    const response = await fetch(url);
    return response.json();
}




export async function loadCountries(map) {


    // Call the getCcaCodes function to get the data
    //const codes = await getCcaCodes();

    // Extract only the cca3 codes
    //const cca3Codes = codes.map(country => country.cca3);

    const countriesData = await fetchCountryData();


    function filterCountries(continent, countryIsoA3) {
        if (continent) {
            // Filter countries based on whether the specified continent is included in the "continents" property
            return countriesData.filter(country => {
                return country.continents.includes(continent);
            });
        } else if (countryIsoA3) {
            // Filter countries based on the specified ISO A3 code
            return countriesData.filter(country => {
                return country.cca3 === countryIsoA3;
            });
        } else {
            // If neither continent nor country is specified, return all countries
            return countriesData;
        }
    }
    
       
    
    const filteredCountries = filterCountries(continent, countryIsoA3);
    console.log(filteredCountries);
    

    //console.log("Number of countries for continent", continent, ":", filteredCountries.length);

    // Extract cca3 codes of countries from the filtered countries data
    const cca3Codes = filteredCountries.map(country => country.cca3);
    const cca2Codes = filteredCountries.map(country => country.cca2);

    setCca2Codes(cca2Codes);

    console.log(cca3Codes);

    //cca3Codes.push("KOS");
    const startTime = performance.now(); // Start time



    const data = await fetchNaturalEarthData();
    console.log(data);

  


    
    // Filter GeoJSON data based on cca3Codes and continent
    const filteredFeatures = data.features.filter(feature => {
        const isoA3Included = cca3Codes.includes(feature.properties.ISO_A3);
        const adm0A3Included = cca3Codes.includes(feature.properties.ADM0_A3);
        //const continentIncluded = feature.properties.CONTINENT === continent;
        // Return true if it is included in either "ISO_A3" or "ADM0_A3", and also in the designated continent
        return isoA3Included || adm0A3Included;
    });


    
    console.log("Number of features:", filteredFeatures.length);
    console.log(filteredFeatures);

    
    
    


    // Iterate over each filtered feature
    filteredFeatures.forEach(feature => {
        // Add filtered feature to map
        const geojsonLayer = L.geoJSON(feature).addTo(map);
        geojsonLayer.bringToBack();
        geojsonLayer.setStyle({ weight: 1 });

        if (feature.properties.ISO_A2 === "DE") {
            console.log(feature.properties);
        }

        // Add click event listener for the feature
        geojsonLayer.eachLayer(layer => {
            layer.on('click', function (event) {
                // Access feature properties to get information about the administrative division
                const featureProperties = event.target.feature.properties;
                const featureGeometry = event.target.feature.geometry;

                console.log(featureProperties);
                console.log(featureGeometry);
                



                // Extract the name of the administrative division
                const adminDivisionName = featureProperties.NAME;
                // Example: You can log the name of the administrative division
                console.log("Clicked on:", adminDivisionName);
                layer.setStyle({ color: "orange" });
                layer.setStyle({ weight: 2 });
            });
        });
    });

    const endTime = performance.now(); // End time
    const totalTime = endTime - startTime; // Total time in milliseconds
    console.log("Time taken to fetch and add GeoJSON data:", totalTime, "ms");
}

let cca2Codes;

function setCca2Codes(value) {
    cca2Codes = value;
}

export function getCca2Codes() {
    return cca2Codes;
}