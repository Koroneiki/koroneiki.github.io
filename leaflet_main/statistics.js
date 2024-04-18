import { ApiURLConstructor } from './apiconstructor.js';


export let populationThresholdStatistics = 0;

export async function getStatistics() {
    const preset = 'Statistics'; // Example preset name
    const cityName = undefined; // City name is not used in this scenario

    const apiUrl = await ApiURLConstructor(preset, cityName);
    console.log(apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (data) {
            console.log(data.total_count);
            return data.total_count;
        } else {
            throw new Error('No data available');
        }
    } catch (error) {
        console.error('Error fetching statistics:', error.message);
        throw error;
    }
}


// Funktion aufrufen mit verschiedenen Bevölkerungswerten
export async function callWithDifferentPopulations() {
    const populations = [-1, 100000, 1000000, 5000000, 10000000];

    for (let population of populations) {
        populationThresholdStatistics = population;
        try {
            const statistics = await getStatistics();
            console.log(`Statistiken für Bevölkerung von ${population}: ${statistics}`);
        } catch (error) {
            console.error('Fehler beim Abrufen der Statistiken:', error.message);
        }
    }
}


