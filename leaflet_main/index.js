// Function to start the game based on the selected option and slider value
function startGame(selectedOptionName, populationValue) {
    // Store the selected option value and slider value in sessionStorage
    sessionStorage.setItem('selectedOption', selectedOptionName);

    if(populationValue) {
        sessionStorage.setItem('populationValue', populationValue);
    }

    console.log(selectedOptionName);
    console.log(populationValue);
    
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
        var populationValue = undefined;
    } else if (selectedOptionId === 'german-cities') {
        selectedOptionName = 'DE_Cities';
        var populationValue = document.getElementById('population-slider').value;
    } else {
        // Handle unexpected option IDs
        console.error('Unexpected option ID:', selectedOptionId);
        return;
    }
    
    
    
    
    // Start the game with the selected option and slider value
    startGame(selectedOptionName, populationValue);
});


// Get references to the slider and span elements
const slider = document.getElementById('population-slider');
const sliderValue = document.getElementById('slider-value');

// Function to update the text content of the span element
function updateSliderValue() {
    // Get the current value of the slider
    const sliderNumber = slider.value;
    
    // Format the number with locale-specific separators
    const formattedNumber = Number(sliderNumber).toLocaleString();
    
    // Update the text content of the span element with the formatted number
    sliderValue.textContent = `Population > ${formattedNumber}`;
}
  

// Add event listener to the slider input event
slider.addEventListener('input', updateSliderValue);

// Initial call to update the slider value when the page loads
updateSliderValue();
