function loadCities(map, cityName, callback) {
    fetch('sorted_cities.json')
    .then(response => response.json())
    .then(data => {
        console.log('GeoJSON data loaded successfully:', data);
        
        // Function to calculate marker radius based on population
        function calculateMarkerRadius(population) {
            // Adjust the scale factor and exponent as needed
            const scaleFactor = 0.01;
            const exponent = 0.5;
            return Math.pow(population, exponent) * scaleFactor;
        }

        // Iterate through the cities until a match is found
        for (const city of data) {
            const cityNameLC = cityName.toLowerCase();
            // Check if the city name or ascii name matches the provided city name
            if ((city.properties.name && city.properties.name.toLowerCase() === cityNameLC) ||
                (city.properties.ascii_name && city.properties.ascii_name.toLowerCase() === cityNameLC) ||
                (city.properties.alternate_names && // Check if alternate_names exists and is not null
                city.properties.alternate_names.some(altName => altName.toLowerCase() === cityNameLC))) {
                // Create circle markers for cities
                const cityName = city.properties.name;
                const cityCoordinates = city.geometry.coordinates.reverse(); // Reverse the coordinates for Leaflet
                const cityPopulation = city.properties.population;

                // Create a circle marker for the city with dynamic radius
                const circleMarker = L.circleMarker(cityCoordinates, {
                    radius: calculateMarkerRadius(cityPopulation),
                    fillColor: 'red',
                    color: 'black',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);

                // Create the content for the popup, including city name and population
                const popupContent = `<b>${cityName}</b><br>Population: ${cityPopulation.toLocaleString()}`;

                // Bind the popup with the content to the circle marker
                circleMarker.bindPopup(popupContent);

                // Call the callback with a truthy value to indicate success
                callback(true);
                return; // Exit the loop once a match is found
            }
        }
        
        // If no city is found, log a message and call the callback with a falsy value to indicate failure
        console.log('City not found:', cityName);
        callback(false);
    })
    .catch(error => {
        console.error('Error loading GeoJSON data:', error);
        callback(false); // Call the callback with a falsy value to indicate failure
    });
}

export { loadCities };
