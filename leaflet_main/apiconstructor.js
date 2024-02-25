
import { getCca2Codes } from "./countries.js";

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

export function ApiURLConstructor(indexJSvalue, populationThreshold, cityName, getCityStatistics) {
    const baseUrl = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/';
    let whereConditions = [];

    function CityStatisticConstructor(populationStatThreshold) {
        const datasetId = 'geonames-all-cities-with-a-population-1000';
        const countryCode = undefined;
        const cityName = undefined;
        const limit = 1;

        whereConditions.push(`population>${populationStatThreshold}`);

        return constructURL(baseUrl, datasetId, whereConditions, limit);

    }

    if(getCityStatistics === true) {
        let populationStatThreshold = 1000000;
        return CityStatisticConstructor(populationStatThreshold);
    }

    if (indexJSvalue === 'Free_Mode') {
        const datasetId = 'geonames-all-cities-with-a-population-1000';
        const countryCode = undefined;
        const limit = 1;

        let [city, country] = cityName.split(',').map(part => part.trim()); // Split city and country

        // Process city name
        const formattedCityName = toTitleCase(city.toLowerCase());
        whereConditions.push(`alternate_names="${formattedCityName}"`);

        // Process country name
        if (country) {
            const formattedCountryName = toTitleCase(country.toLowerCase());
            whereConditions.push(`cou_name_en="${formattedCountryName}"`);
        }

        // Retrieve country codes array
        const countryCodes = getCca2Codes();

        if (countryCodes.length <= 100) {
            // Add where conditions for each country code with OR logic
            const countryCodeConditions = countryCodes.map(countryCode => `country_code="${countryCode}"`).join(' or ');
            whereConditions.push(`(${countryCodeConditions})`);
        }



        //WICHTIG-DEFAULT-STATEMENT
        whereConditions.push(`feature_code!="PPLX"`);
        
        
        return constructURL(baseUrl, datasetId, whereConditions, limit);

    } else if (indexJSvalue === 'DE_Cities') {
        const datasetId = 'geonames-all-cities-with-a-population-1000';
        const countryCode = "DE";
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
