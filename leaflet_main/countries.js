function loadCountries(map) {
    const apiUrl = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=georef-world-country&rows=250&facet=sovereignt';

    // Get the current time before making the API request
    const startTime = new Date();

    // Load countries data from the API URL
    fetch(apiUrl)
    .then(response => response.json())
    .then(countriesData => {

        // Get the current time after receiving the API response
        const endTime = new Date();
        const responseTime = endTime - startTime;
        console.log("API response time:", responseTime, "milliseconds");

        console.log("Countries data:", countriesData); // Debugging: Log the loaded countries data
        
        // Extract features from the API response
        const features = countriesData.records.map(record => ({
            type: 'Feature',
            geometry: record.fields.geo_shape,
            properties: {
                name: record.fields.cntry_name_en, // Assuming the English name is available
                code: record.fields.cntry_area_code // Assuming the country code is available
            }
        }));
        console.log(features);

        
        console.log("Country names:", features.map(feature => feature.properties.name));


        // Function to find neighboring countries of a given country
        function findNeighboringCountries(countryName) {
            const country = features.find(feature => feature.properties.name === countryName);
            if (!country) {
                console.log('Country not found');
                return;
            }

            const neighboringCountries = features.filter(feature => {
                if (feature.properties.name !== countryName) {
                    // Check if the geometries intersect using Turf.js
                    return turf.booleanIntersects(country.geometry, feature.geometry);
                }
                return false;
            }).map(feature => feature.properties.name);

            console.log(`Neighboring countries of ${countryName}:`, neighboringCountries);
        }

        // Example usage
        const countryToFind = "Germany";
        findNeighboringCountries(countryToFind);

        const germanyFeature = features.find(feature => feature.properties.name === "Germany");
        console.log(germanyFeature);


        // Add the filtered GeoJSON data to the map and define a click event
        L.geoJSON(features, {
            style: function(feature) {
                return {
                    fillColor: 'blue', // Standard color for countries
                    weight: 2,
                    //stroke: false, 
                    opacity: 1,
                    color: 'red', // Set border color to match fill color
                    fillOpacity: 0.7,
                };
            },

            

            onEachFeature: function(feature, layer) {
                layer.on('click', function() {
                    layer.setStyle({fillColor: '#ff5733', color: '#ff5733'}); // Change the color of the clicked country
                    console.log(feature.properties.name); // Log the name of the country to the console
                });
            }
        }).addTo(map);
    });
}

export { loadCountries };
