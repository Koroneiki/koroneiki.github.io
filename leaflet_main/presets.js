import { toTitleCase } from "./functions.js";
import { populationThresholdStatistics } from "./statistics.js";
import { getCca2Codes } from "./countries.js";
import { populationThreshold } from "./map.js";


export async function getCityStatisticsPreset() {

    const ccaCodes = await getCca2Codes();

    const whereConditions = [`population>${populationThresholdStatistics}`];
    whereConditions.push(`feature_code!="PPLX"`);

    //ccaCodes.forEach(cca => {
    //    whereConditions.push(`country_code="${cca}"`);
    //});

    //console.log(whereConditions);

    return {
        datasetId: 'geonames-all-cities-with-a-population-1000',
        countryCode: undefined,
        cityName: undefined,
        whereConditions,
        limit: 5
    };
}

export function freeModePreset(cityName) {
    let [city, country] = cityName.split(',').map(part => part.trim()); // Split city and country

    // Process city name
    const formattedCityName = toTitleCase(city.toLowerCase());
    const whereConditions = [`alternate_names="${formattedCityName}"`];

    // Process country name
    if (country) {
        const formattedCountryName = toTitleCase(country.toLowerCase());
        whereConditions.push(`cou_name_en="${formattedCountryName}"`);
    }

    // Add default condition
    whereConditions.push(`feature_code!="PPLX"`);

    return {
        datasetId: 'geonames-all-cities-with-a-population-1000',
        countryCode: undefined,
        cityName: undefined,
        whereConditions,
        limit: 1
    };
}

export function deCitiesPreset() {

    const whereConditions = [`feature_code!="PPLX"`, `population>${populationThreshold}`];

    let countryCode = "DE";
    whereConditions.push(`country_code="${countryCode}"`);

    return {
        datasetId: 'geonames-all-cities-with-a-population-1000',
        countryCode: "DE",
        cityName: undefined,
        whereConditions,
        limit: 100
    };
}