


// Function to convert string to title case
function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function constructURL(baseUrl, datasetId, whereConditions, limit) {

    // Construct the URL with datasetId and parameters
    let apiUrl = `${baseUrl}${datasetId}/records?limit=${limit}`;

    // Append where statements if provided
    if (whereConditions.length > 0) {
        apiUrl += '&where=' + whereConditions.map(condition => encodeURIComponent(condition)).join('&where=');
    }

    // Add order_by statement (default to population desc)
    apiUrl += '&order_by=' + encodeURIComponent('population desc');

    return apiUrl;
}

export function ApiURLConstructor(indexJSvalue, cityName) {
    const baseUrl = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/';
    let whereConditions = [];

    if (indexJSvalue === 'Free_Mode') {
        const datasetId = 'geonames-all-cities-with-a-population-1000';
        const countryCode = undefined;
        const populationThreshold = undefined;
        const limit = 1;

        const formattedCityName = toTitleCase(cityName.toLowerCase());
        whereConditions.push(`alternate_names="${formattedCityName}"`);

        //WICHTIG-DEFAULT-STATEMENT
        whereConditions.push(`feature_code!="PPLX"`);
        
        if(populationThreshold) {
            whereConditions.push(`population>${populationThreshold}`);
        }
        return constructURL(baseUrl, datasetId, whereConditions, limit);

    } else if (indexJSvalue === 'DE_Cities') {
        const datasetId = 'geonames-all-cities-with-a-population-1000';
        const countryCode = "DE";
        const populationThreshold = 500000;
        const limit = 100;
        const cityName = undefined;

        //WICHTIG-DEFAULT-STATEMENT
        whereConditions.push(`feature_code!="PPLX"`);


        const formattedCountryCode = countryCode.toUpperCase();
        whereConditions.push(`country_code="${formattedCountryCode}"`);
        whereConditions.push(`population>${populationThreshold}`);

        return constructURL(baseUrl, datasetId, whereConditions, limit);

    }
}
