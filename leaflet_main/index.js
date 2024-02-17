// Function to start the game based on the selected option
function startGame(selectedOptionName) {
    // Store the selected option value in sessionStorage
    sessionStorage.setItem('selectedOption', selectedOptionName);
    
    // Redirect to map.html
    window.location.href = 'map.html';
}

// Add event listener to the start button
document.getElementById('start-button').addEventListener('click', function() {
    // Determine which option is selected
    var selectedOptionId = document.querySelector('input[name="selector"]:checked').id;
    
    // Determine the name corresponding to the selected option
    var selectedOptionName;
    if (selectedOptionId === 'free-mode') {
        selectedOptionName = 'Free_Mode';
    } else if (selectedOptionId === 'german-cities') {
        selectedOptionName = 'DE_Cities';
    } else {
        // Handle unexpected option IDs
        console.error('Unexpected option ID:', selectedOptionId);
        return;
    }
    
    // Start the game with the selected option
    startGame(selectedOptionName);
});
