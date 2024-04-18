




let cachedNaturalEarthData = null;
const countryDataCache = {};

// Function to fetch Natural Earth data
export async function fetchNaturalEarthData() {
    // Check if data is already cached
    if (cachedNaturalEarthData) {
        console.log("Returned NE-Data from cache.")
        return cachedNaturalEarthData;
    }

    const geojsonURL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries_deu.geojson";
    const url = 'https://corsproxy.io/?' + encodeURIComponent(geojsonURL);
    
    // Fetch data from the URL
    const response = await fetch(url);
    
    // Parse response to JSON
    const jsonData = await response.json();

    // Cache the JSON data
    cachedNaturalEarthData = jsonData;

    return jsonData;
}


export async function fetchCountryData() {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    const excludedCca3Codes = ['UNK', 'PSE'];

    try {
        // Check if data is cached
        if (countryDataCache[apiUrl]) {
            console.log('Data retrieved from cache');
            return countryDataCache[apiUrl];
        }

        // Start the timer
        const startTime = performance.now();

        // Fetch data from the API
        const response = await fetch(apiUrl);

        // If response is not okay, throw an error
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
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

        // Log the retrieved data
        console.log(data);

        // Extract unique subregions
        const subregions = [...new Set(data.map(country => country.subregion))];

        // Log the available subregions
        console.log('Available Subregions:', subregions);

        // Cache the fetched data
        countryDataCache[apiUrl] = data;

        return data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}


export async function cacheData() {

    await fetchNaturalEarthData();

    await fetchCountryData();

}
