// Function to start the game based on the selected option, slider value, and dropdown value
function startGame(selectedOptionName, populationValue, dropdownValue) {
    // Store the selected option value, slider value, and dropdown value in sessionStorage
    sessionStorage.setItem('selectedOption', selectedOptionName);
    sessionStorage.setItem('dropdownValue', dropdownValue); // Store dropdown value
    
    if(populationValue) {
        sessionStorage.setItem('populationValue', populationValue);
    }

    console.log(selectedOptionName);
    console.log(populationValue);
    console.log(dropdownValue);
    
    // Redirect to map.html
    window.location.href = 'map.html';
}

// Add event listener to the start button
document.getElementById('start-button').addEventListener('click', function() {
    // Determine which option is selected
    var selectedOptionId = document.querySelector('input[name="selector"]:checked').id;
    
    // Determine the name corresponding to the selected option
    var selectedOptionName;
    var dropdownValue; // Variable to store the dropdown value
    var populationValue;
    
    if (selectedOptionId === 'free-mode') {
        selectedOptionName = 'Free_Mode';
        dropdownValue = document.getElementById('free-mode-dropdown').value; // Get dropdown value
        populationValue = undefined;
    } else if (selectedOptionId === 'german-cities') {
        selectedOptionName = 'DE_Cities';
        dropdownValue = undefined;
        populationValue = document.getElementById('population-slider').value;
    } else {
        // Handle unexpected option IDs
        console.error('Unexpected option ID:', selectedOptionId);
        return;
    }
    
    // Start the game with the selected option, dropdown value, and slider value
    startGame(selectedOptionName, populationValue, dropdownValue);
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

document.addEventListener("DOMContentLoaded", (event) => {
    updateSliderValue();
});
  

// Add event listener to the slider input event
slider.addEventListener('input', updateSliderValue);


