function loadCities(map, cityName, callback) {
    // Function to convert string to title case
    function toTitleCase(str) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Convert cityName to lowercase and then to title case
    const formattedCityName = toTitleCase(cityName.toLowerCase());

    // Construct the API URL with the formatted cityName
    const apiUrl = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=alternate_names=\'' + encodeURIComponent(formattedCityName) + '\'&order_by=population%20desc&limit=1';

    // Fetch data from the API
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('API data loaded successfully:', data);

        // Extract city information from the API response
        const cityData = data.results[0]; // Assuming the API returns the most relevant city as the first result

        if (cityData) {
            // Extract city properties from the API response
            const cityName = cityData.name;
            const cityCoordinates = [cityData.coordinates.lat, cityData.coordinates.lon]; // Assuming latitude and longitude are provided in the API response
            const cityPopulation = cityData.population;

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
        } else {
            console.error('City data not found.');
            callback(false);
            // Handle the case where city data is not found
        }
    })
    .catch(error => {
        console.error('Error loading city data from API:', error);
        callback(false);
    });

    // Function to calculate marker radius based on population
    function calculateMarkerRadius(population) {
        // Adjust the scale factor and exponent as needed
        const scaleFactor = 0.01;
        const exponent = 0.5;
        return Math.pow(population, exponent) * scaleFactor;
    }
}


export { loadCities };
