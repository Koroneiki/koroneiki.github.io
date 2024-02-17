
import './eventlisteners.js';
import { searchCity} from './functions.js';
import { returnCities } from './cities.js';


var default_map_url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";


// Initialisiere die Leaflet-Karte
export var map = L.map('map', {
    center: [51.1657, 10.4515], // Zentriere die Karte auf Deutschland
    zoom: 6, // Passe den initialen Zoom-Level bei Bedarf an
    maxBounds: [ // Definiere den maximalen Bereich der Karte
        [90, -220], // Oben links: Nordpol, Westliche Hemisphäre
        [-90, 220]  // Unten rechts: Südpol, Östliche Hemisphäre
    ],
    zoomControl: false,
    layers: [
        L.tileLayer(default_map_url, { 
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
    ]
});

//MAP-OPTIONS
function mapOptions (map) {

    addCustomZoomControl(map);

    function addCustomZoomControl(map) {
        // Erstelle eine neue Instanz der Zoom-Steuerung mit Optionen
        var zoomControl = L.control.zoom({
            position: 'bottomright' // Positioniere die Zoom-Steuerung unten rechts
        });

        
        zoomControl.addTo(map);
    }
}
mapOptions(map);



async function gameFunction() {
    // Retrieve the selected option value from sessionStorage
    //var selectedOption = sessionStorage.getItem('selectedOption');
    var selectedOption = indexJSvalue;

    // Check if selectedOption is not null
    if (selectedOption) {
        // Depending on the value, carry out different actions
        if (selectedOption === 'Free_Mode') {

            var scoreContainerclick = document.querySelector('.score-container-click');
            if (scoreContainerclick) {
                scoreContainerclick.style.display = 'none';
            }

            
        } else if (selectedOption === 'DE_Cities') {
            
            var scoreContainer = document.querySelector('.score-container');
            if (scoreContainer) {
                scoreContainer.style.display = 'none';
            }

            var searchcontainer = document.querySelector('.search-container');
            if (searchcontainer) {
                searchcontainer.style.display = 'none';
            }



            custompopupEnabled(false);
            clickEnabled(true);

            await searchCity(map);

            const cities = returnCities();
            console.log(cities);


            // Function to shuffle an array
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            // Function to update the score container with the number of guessed cities and total cities
            function updateScoreContainer(guessedCount, totalCount) {
                const scoreContainer = document.querySelector('.score-container-click');
                const guessedCitiesElement = scoreContainer.querySelector('#guessed-count');
                const totalCitiesElement = scoreContainer.querySelector('#total-count');
                guessedCitiesElement.textContent = guessedCount;
                totalCitiesElement.textContent = totalCount;
            }

            // Update the city name element with the guessed city
            function updateCityName(cityName) {
                const cityNameContainer = document.getElementById('city-name-container');
                cityNameContainer.textContent = cityName;
            }


            // Function to start the guessing game with cities in random order
            async function startGuessingGameRandomOrder(cities) {
                // Shuffle the cities array
                const shuffledCities = shuffleArray([...cities]);
                
                // Update the total number of cities in the score container
                updateScoreContainer(0, shuffledCities.length);

                // Initialize guessed cities count
                let guessedCitiesCount = 0;
                let guessedCities = [];

                // Iterate over each city in the shuffled array
                for (const correctCity of shuffledCities) {
                    // Display the name of the city
                    console.log("Guess the city:", correctCity.name);
                    updateCityName(correctCity.name);

                    // Add a click event listener to the circle
                    const clickedCity = await new Promise(resolve => {
                        if (clickEnabled) {
                            cities.forEach(city => {
                                if (!guessedCities.includes(city)) {
                                    city.circle.once('click', function(e) {
                                        resolve(city);
                                    });
                                }
                            });
                        }
                    });


                    // Find the corresponding city object from the cities array
                    const currentCity = cities.find(city => city.name === correctCity.name);

                    // Update the guessed cities count and score container
                    if (clickedCity === correctCity) {
                        guessedCitiesCount++;
                        updateScoreContainer(guessedCitiesCount, shuffledCities.length);
                        console.log("Congratulations! You guessed correctly.");

                        guessedCities.push(correctCity);

                        // Remove the click event listener for the clicked city
                        currentCity.circle.off('click');

                        

                        // Change the circle color to green
                        currentCity.circle.setStyle({ fillColor: 'green' });

                        // Mouseover event for currentCity.circle
                        currentCity.circle.on('mouseover', function (e) {
                            this.setStyle({
                                fillColor: 'lightgreen', // Change fill color on hover
                            });
                        });

                        // Mouseout event for currentCity.circle
                        currentCity.circle.on('mouseout', function (e) {
                            this.setStyle({
                                fillColor: 'green' // Restore original fill color on mouseout
                            });
                        });

                    } else {
                        console.log("Sorry, wrong guess. The correct city was:", correctCity.name);
                    }

                }
                alert(`You guessed ${guessedCitiesCount} cities correctly out of ${shuffledCities.length}.`);
                updateCityName(`${guessedCitiesCount} cities correct out of ${shuffledCities.length}.`);


            }

            
            startGuessingGameRandomOrder(cities);




            

        } else {
            // Handle unexpected values
            console.error('Unexpected value stored in sessionStorage:', selectedOption);
        }
    } else {
        // Handle case where selected option is not found in sessionStorage
        console.error('Selected option not found in sessionStorage.');
    }
}

export function clickEnabled(value) {
    return clickEnabled = value;
}

export function custompopupEnabled(value) {
    return custompopupEnabled = value;
}

export var indexJSvalue = sessionStorage.getItem('selectedOption');
export var populationThreshold = sessionStorage.getItem('populationValue');

// Function to update the population threshold text
function updatePopulationThreshold(populationValue) {
    // Get reference to the span element
    const populationSpan = document.getElementById('population-value');
    
    // Update the text content of the span element with the population value
    populationSpan.textContent = Number(populationValue).toLocaleString();
}

// Example usage:
const populationValue = populationThreshold; // Replace with the actual population value
updatePopulationThreshold(populationValue);


gameFunction();
