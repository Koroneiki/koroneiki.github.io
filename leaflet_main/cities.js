let totalPopulation = 0;
let guessedCities = 0;

let cities = [];

export function loadCities(map, cityName, callback) {
    
    // Function to convert string to title case
    function toTitleCase(str) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }


    // Convert cityName to lowercase and then to title case
    const formattedCityName = toTitleCase(cityName.toLowerCase());

    // Construct the API URL with the formatted cityName
    const apiUrl = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=alternate_names=\'' + encodeURIComponent(formattedCityName) + '\'&order_by=population%20desc&limit=1';
    console.log(apiUrl);

    // Get the current time before making the API request
    const startTime = new Date();

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            // Get the current time after receiving the API response
            const endTime = new Date();
            const responseTime = endTime - startTime;
            console.log("API response time:", responseTime, "milliseconds");

            console.log('API data loaded successfully:', data);

            // Extract city information from the API response
            const cityData = data.results[0]; // Assuming the API returns the most relevant city as the first result

            if (cityData) {
                
                // Extract city properties
                const cityProperties = {
                    name: cityData.name,
                    coordinates: [cityData.coordinates.lat, cityData.coordinates.lon],
                    population: cityData.population,
                    geoname_id: cityData.geoname_id
                };



                // Iterate over the cities array
                for (const city of cities) {
                    // Check if the current city's id matches cityData.geoname_id
                    if (city.geoname_id === cityData.geoname_id) {
                        console.log("City already guessed.");
                        callback(false);
                        return;
                    }
                }

                // Push city properties to the cities array
                cities.push(cityProperties);
                

                // Now you have an object containing properties for the city
                console.log(cityProperties);
                console.log(cities);

                // Extract city properties from the API response
                const cityName = cityData.name;
                const cityCoordinates = [cityData.coordinates.lat, cityData.coordinates.lon];
                const cityPopulation = cityData.population;

                updatePopulationandCityCounter(cityPopulation);
                console.log(cityData.geoname_id);
                

                // Create a circle marker for the city with dynamic radius
                const circle = L.circle(cityCoordinates, {
                    radius: getRadiusFromPopulation(cityPopulation, 5000),
                    fillColor: 'red',
                    color: 'black',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.4,
                    population: cityPopulation,
                    id: cityData.geoname_id,
                    coordinates: cityCoordinates
                }).addTo(map);

                // Create the content for the popup, including city name and population
                const popupContent = `<b>${cityName}</b><br>Population: ${cityPopulation.toLocaleString()}`;

                // Bind the popup with the content to the circle marker
                circle.bindPopup(popupContent);


                // Call the callback with a truthy value to indicate success
                callback(true);
            } else {
                console.error('City data not found.');
                callback(false);
                return;
            }
        })
        .catch(error => {
            console.error('Error loading city data from API:', error);
            callback(false);
        });

    // Function to update the population counter
    function updatePopulationandCityCounter(population) {
        totalPopulation += population;
        guessedCities = cities.length;
        document.getElementById('total_population').innerText = 'Total population: ' + totalPopulation.toLocaleString();
        document.getElementById('guessed_cities').innerText = 'Guessed Cities: ' + guessedCities;
        
    }
}


export function getRadiusFromPopulation(population, scalingFactorPopulation) {
    // Multiply population by 1000 to adjust for scale
    const scaledPopulation = population * scalingFactorPopulation;

    // Define a base radius value
    const baseRadius = 600; // Adjust as needed

    // Define the scaling factor
    const scalingFactor = 0.05; // Adjust as needed

    // Calculate the radius based on the scaled population using a logarithmic function
    const radius = Math.sqrt(scaledPopulation * scalingFactor) + baseRadius;

    return radius;
}