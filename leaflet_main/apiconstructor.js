
import { getCityStatisticsPreset, freeModePreset, deCitiesPreset } from "./presets.js";


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


export async function ApiURLConstructor(preset, cityName) {
    const baseUrl = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/';

    if (preset === "Statistics") {
        preset = await getCityStatisticsPreset();
    } else if (preset === 'Free_Mode') {
        preset = await freeModePreset(cityName);
    } else if (preset === 'DE_Cities') {
        preset = await deCitiesPreset();
    }

    return constructURL(baseUrl, preset.datasetId, preset.whereConditions || [], preset.limit);
}
