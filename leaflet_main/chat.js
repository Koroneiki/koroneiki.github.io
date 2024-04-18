import { returnCities } from "./cities.js";

export function renderChatMessage() {

    const chatContainer = document.getElementById('chat-container');
    const chatMessages = document.querySelectorAll('.chat-message');

    function addChatMessage(message) {
        const chatMessage = document.createElement('div');
        chatMessage.classList.add('chat-message');
        chatMessage.innerHTML = message;

        // Add fade-out effect after 2.5 seconds
        setTimeout(() => {
            chatMessage.classList.add('fade-out');
        }, 2500);

        // Hide the chat container after 3.5 seconds
        setTimeout(() => {
            chatMessage.style.display = 'none';
        }, 3500);

        // Remove the oldest chat container if there are more than three
        if (chatMessages.length >= 3) {
            const removedContainer = chatContainer.lastElementChild;
            chatContainer.removeChild(removedContainer);
        }

        // Insert the new chat container at the top
        chatContainer.insertAdjacentElement('afterbegin', chatMessage);
    }


    const chatMessage = constructChatMessage();

    addChatMessage(chatMessage);

}


function constructChatMessage() {

    const cities = returnCities();
    const currentCity = cities[cities.length - 1];
    console.log(currentCity);

    let message = `
        <span style="color: blue;">${currentCity.name},</span>`;

    if (currentCity.country_code === "US") {
        message += `
        <span style="color: blue;">${currentCity.admin1_code},</span>`;
    }

    message += `
        <span style="color: blue;">${currentCity.cou_name_en}</span>
        <span style="color: black;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span style="color: green;">+ ${currentCity.population.toLocaleString()}</span>
    `;

    return message;
}

