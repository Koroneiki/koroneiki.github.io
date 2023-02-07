const inputField = document.getElementById("input-field");
const svg = document.querySelector("svg");
const paths = Array.from(svg.querySelectorAll("path"));
const counter = document.getElementById("counter");

let correctlyGuessedCountries = 0;

inputField.addEventListener("input", function() {
  const inputValue = inputField.value;
  const matchingPath = paths.find(path => path.getAttribute("name").toLowerCase() === inputValue.toLowerCase());
  if (matchingPath) {
    inputField.value = "";
    matchingPath.style.fill = "green";
    correctlyGuessedCountries++;
    counter.innerHTML = `${correctlyGuessedCountries}/44`;
  }
});
