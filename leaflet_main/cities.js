

import { custompopupEnabled } from "./gamefunction.js";
import { getCityStatistics, setCityStatistics } from './gamefunction.js';
import { getCca2Codes } from "./countries.js";

let totalPopulation = 0;
let guessedCities = 0;

let cities = [];



export function loadCities(map, apiUrl, callback) {
    
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

            const total_count = data.total_count;
            console.log("Total count: " + total_count);
            

            
            
            
            if(getCityStatistics()) {
                setCityStatistics(false);
                return callback(false);               
            }

            // Extract city information from the API response
            const cityResults = data.results; 

            if (cityResults && cityResults.length > 0) {
                cityResults.forEach(cityData => {


                    // Check if the city has already been guessed
                    if (cities.some(city => city.geoname_id === cityData.geoname_id)) {
                        console.log("City already guessed.");
                        
                        
                        return callback(false);
                        
                    }

                    const cca2Codes = getCca2Codes();
                    console.log(cca2Codes);

                    if (!cca2Codes.includes(cityData.country_code)) {
                        console.log("Not included in Settings.");
                        return callback(false);
                    }
                    


                    const cityName = cityData.name;
                    const cityCoordinates = [cityData.coordinates.lat, cityData.coordinates.lon];
                    const cityPopulation = cityData.population;


                    // Create a circle marker for the city with dynamic radius
                    const circle = L.circle(cityCoordinates, {
                        radius: getRadiusFromPopulation(cityPopulation, document.getElementById("scaling-slider").value),
                        fillColor: 'red',
                        color: 'black',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.4,
                        population: cityPopulation,
                        id: cityData.geoname_id,
                        coordinates: cityCoordinates
                    }).addTo(map);



                    // Extract city properties
                    const cityProperties = {
                        name: cityData.name,
                        coordinates: [cityData.coordinates.lat, cityData.coordinates.lon],
                        population: cityData.population,
                        geoname_id: cityData.geoname_id,
                        circle: circle
                    };

                    

                    

                    callback(true);

                    cities.push(cityProperties);

                    console.log(cityProperties);
                    console.log(cities);

                    
                    updatePopulationandCityCounter(cityPopulation);
                    
                    

                    circle.on('click', function() {
                        console.log(cityName);
                    });


                    circle.on('mouseover', function (e) {
                        this.setStyle({
                            fillColor: 'lightcoral' // Change fill color on hover
                        });
                    });

                    // Remove hover animation on mouseout
                    circle.on('mouseout', function (e) {
                        this.setStyle({
                            fillColor: 'red' // Restore original fill color on mouseout
                        });
                    });

                    if(custompopupEnabled) {
                        // Define custom HTML content for the popup
                        const customPopupContent = document.createElement('div');
                        customPopupContent.className = 'custom-popup';
                        customPopupContent.innerHTML = `<b>${cityName}</b><br>Population: ${cityPopulation.toLocaleString()}`;

                        // Hide the custom popup initially
                        customPopupContent.style.display = 'none';
                        customPopupContent.style.zIndexOffset = '1000';

                        // Add the custom popup content to the map container
                        map.getContainer().appendChild(customPopupContent);
                        

                        
                        // Add hover animation on mouseover
                        circle.on('mouseover', function (e) {
                            customPopupContent.style.display = 'block';
                            updatePopupPosition(e);
                        });

                        // Remove hover animation on mouseout
                        circle.on('mouseout', function (e) {
                            customPopupContent.style.display = 'none';
                        });

                        // Update the position of the custom popup based on the mouse cursor
                        map.on('mousemove', function (e) {
                            updatePopupPosition(e);
                        });

                        // Function to update the position of the custom popup based on the mouse cursor
                        function updatePopupPosition(e) {
                            const offsetX = 0;
                            const offsetY = -customPopupContent.offsetHeight;
                            customPopupContent.style.left = e.containerPoint.x + offsetX + 'px';
                            customPopupContent.style.top = e.containerPoint.y + offsetY + 'px';
                        }


                        
                    }
                    



                });

                
            } else {
                console.error('No city data found.');
                callback(false);
            }
        })
        .catch(error => {
            console.error('Error loading city data from API:', error);
            callback(false);
        });

    function updatePopulationandCityCounter(population) {
        totalPopulation += population;
        guessedCities = cities.length;
        document.getElementById('total_population').innerText = 'Total population: ' + totalPopulation.toLocaleString();
        document.getElementById('guessed_cities').innerText = 'Guessed Cities: ' + guessedCities;
    }





}

export function getRadiusFromPopulation(population, scalingFactorPopulation) {

    const scaledPopulation = population * scalingFactorPopulation;

    const baseRadius = 600;

    const scalingFactor = 0.05;

    const radius = Math.sqrt(scaledPopulation * scalingFactor) + baseRadius;

    return radius;
}

export function returnCities() {
    return cities;
}


