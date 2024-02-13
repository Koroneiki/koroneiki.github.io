

function loadCountries(map) {
    // Load the countries.json file
    fetch('countries.json')
    .then(response => response.json())
    .then(countriesData => {
        console.log("Countries data:", countriesData); // Debugging: Log the loaded countries data
        
        // Extract the alpha3 codes of sovereign countries
        const sovereignCountries = countriesData.map(country => country.alpha3.toLowerCase());
        console.log("Sovereign countries:", sovereignCountries); // Debugging: Log the sovereign countries list
        
        // Load the alle länder.json GeoJSON file
        fetch('alle länder copy.json')
        .then(response => response.json())
        .then(data => {
            console.log("GeoJSON data:", data); // Debugging: Log the loaded GeoJSON data
            
            // Filter the GeoJSON data to only include features with iso_a3 codes found in sovereignCountries
            const filteredData = data.features.filter(feature => {
                // Convert iso_a3 to lowercase for case-insensitive comparison
                const isoA3 = feature.properties.iso_a3.toLowerCase();
                const isoA3_eh = feature.properties.iso_a3_eh.toLowerCase();
                return sovereignCountries.includes(isoA3) || sovereignCountries.includes(isoA3_eh);
            });
            
            console.log("Filtered data:", filteredData); // Debugging: Log the filtered GeoJSON data
            
            // Add the filtered GeoJSON data to the map and define a click event
            L.geoJSON(filteredData, {
                style: function(feature) {
                    return {
                        fillColor: '#3388ff', // Standard color for countries
                        weight: 2, // Set a small border weight to maintain visual separation
                        opacity: 1,
                        color: 'blue', // Set border color to match fill color
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function(feature, layer) {
                    layer.on('click', function() {
                        layer.setStyle({fillColor: '#ff5733', color: '#ff5733'}); // Change the color of the clicked country
                        console.log(feature.properties.name); // Log the name of the country to the console
                    });
                }
            }).addTo(map);
        });
    });
}

export { loadCountries };