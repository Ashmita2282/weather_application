const getInputData = document.getElementById("searchButton");

// API Key
const API_URL = "2806c8f223266044603bdc8e864e6cad";

getInputData.addEventListener("click", function () {
  // Get the input field element
  const cityInputField = document.getElementById("cityInput");

  // Get the value from the city input field and trim it
  let inputCity = cityInputField.value;
  inputCity = inputCity.trim(); // Reassign the trimmed value back to inputCity

  console.log(inputCity);

  if (inputCity) {
    // If a city is entered
    getWeatherData(inputCity); // Fetch weather data for the city

    addRecentSearch(inputCity); // Add the city to recent searches
  } else {
    // If no city is entered
    alert("Please enter a city name."); // Show an alert to enter a city name
  }

  // Clear the input field
  cityInputField.value = "";
});

//Function to fetch weather data by city name
function getWeatherData(inputCity) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${API_URL}`; // API URL with city name
  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      // console.log(data);
      displayWeatherData(data); // Display the fetched weather data
      getExtendedForecast(data.coord.lat, data.coord.lon); // Fetch extended forecast using coordinates
    })
    .catch((error) => {
      // Catch any errors
      alert(
        "Failed to fetch weather data Make sure to enter the correct city."
      ); // Log the error
    });
}

// Function to display weather data by city name on the page
function displayWeatherData(data) {
  const weatherDetails = document.getElementById("weatherDetails"); // Get the weather details element
  if (data.cod === 200) {
    console.log("data", data);
    // If the response is successful
    weatherDetails.innerHTML = ` 
    <div class ="bg-gradient-to-r hover:from-green-300 hover:to-blue-600 from-red-300 to-blue-400 w-full m-0 p-0 flex justify-center rounded m-3 p-3 shadow-lg w-full flex-col sm:flex-row justify-between">
      <div class="gap-4">
         <h2 class="text-2xl font-bold p-2 m-1 gap-2">${data.name}</h2>
          <p class="text-xl p-2 m-1 gap-2">Temp: ${(
            data.main.temp - 273.15
          ).toFixed(2)}°C</p>
          <p class="text-xl p-2 m-1 gap-2">Humidity: ${data.main.humidity}%</p>
          <p class="text-xl p-2 m-1 gap-2">Wind Speed: ${
            data.wind.speed
          } m/s</p>
      </div>
      <div class="m-6 flex flex-col justify-center">
          <p class="text-xl p-2">Weather: ${data.weather[0].description}</p>
          <dotlottie-player src="https://lottie.host/a297dd34-3148-4116-8c24-10adcd82462c/IJebSXPTBq.json" background="transparent" speed="1" loop autoplay 
          class=" h-24 rounded shadow-lg transition ease-in-out delay-200 hover:-translate-y-1 hover:scale-110  duration-300"></dotlottie-player>
      </div>
    </div>     
    `; // Display weather data
  } else {
    weatherDetails.textContent =
      "City not found Please enter the correct city name."; // Display an error message if city is not found
  }
}

// Function to fetch extended forecast 5 day's data
function getExtendedForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_URL}`; // API URL for extended forecast
  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      console.log(data);
      displayExtendedForecast(data); // Display the fetched extended forecast data
    })
    .catch((error) => {
      // Catch any errors
      console.error("Error in fetching extended forecast of 5 days:", error); // Log the error
      document.getElementById("forecastDetails").textContent =
        "Failed to fetch extended forecast of 5 days."; // Display an error message
    });
}

// Function to display extended forecast data on the page
function displayExtendedForecast(data) {
  const forecastDetails = document.getElementById("forecastDetails"); // Get the forecast details element
  const lottiePic = document.querySelector(".lottie-pic"); // Get the lottie-pic element

  if (data.list && data.list.length > 0 && data.cod === "200") {
    lottiePic.classList.remove("hidden"); // Show the lottie-pic element
    // Check if the forecast data is available
    forecastDetails.innerHTML =
      "<div class='col-span-full text-center mb-4'>5-Day Forecast</div>"; // Display the forecast header
    data.list.slice(0, 5).forEach((forecast) => {
      // Loop through the first 5 forecast entries
      const date = new Date(forecast.dt * 1000); // Convert the timestamp to a date
      forecastDetails.innerHTML += `
        <div class="p-4 bg-gradient-to-r hover:from-green-300 hover:to-blue-600 from-red-300 to-blue-400 m-2 flex flex-col justify-between items-center rounded-lg border transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-105 duration-200 shadow-lg h-full">
          <p class="text-xl mb-2">${date.toDateString()}</p>
          <p class="text-lg mb-1">Temp: ${(forecast.main.temp - 273.15).toFixed(
            2
          )}°C</p>
          <p class="text-lg mb-1">Weather: ${
            forecast.weather[0].description
          }</p>
          <p class="text-lg mb-1">Humidity: ${forecast.main.humidity}%</p>
          <p class="text-lg mb-1">Wind Speed: ${forecast.wind.speed} m/s</p>
        </div>
      `; // Display each forecast entry
    });
  } else {
    forecastDetails.textContent = "Extended forecast data not available."; // Display an error message if forecast data is not available
  }
}

// Function to fetch data by current location
const currentlocationButton = document.getElementById("locationButton");

// Add event listener to the location button
currentlocationButton.addEventListener("click", function () {
  if (navigator.geolocation) {
    // Check if the browser supports geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude; // Get latitude
        const lon = position.coords.longitude; // Get longitude
        getWeatherDataByCoords(lat, lon); // Fetch weather data using coordinates
      },
      () => {
        // Error callback
        alert("Unable to retrieve your location."); // Show an alert if unable to get location
      }
    );
  } else {
    // If geolocation is not supported
    alert("Geolocation is not supported by this browser."); // Show an alert
  }
});

// Function to fetch weather data by coordinates current data
function getWeatherDataByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_URL}`; // API URL with coordinates
  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      // console.log(data); // Log the fetched data to the console
      displayWeatherData(data); // Display the fetched weather data
      getExtendedForecast(lat, lon); // Fetch extended forecast using coordinates
    })
    .catch((error) => {
      // Catch any errors
      console.error("Error fetching weather data:", error); // Log the error
      document.getElementById("weatherDetails").textContent =
        "Failed to fetch weather data."; // Display an error message
    });
}

// Function to add a recent search to localStorage
function addRecentSearch(city) {
  let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || []; // Get recent searches from localStorage or initialize an empty array
  if (!recentSearches.includes(city)) {
    // Check if the city is not already in recent searches
    recentSearches.push(city); // Add the city to recent searches
    if (recentSearches.length > 5) recentSearches.shift(); // Keep only the last 5 recent searches
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches)); // Save the updated recent searches to localStorage
  }
  updateRecentSearchesDropdown(); // Update the recent searches dropdown
}

// Function to update the recent searches dropdown
function updateRecentSearchesDropdown() {
  const recentSearches =
    JSON.parse(localStorage.getItem("recentSearches")) || []; // Get recent searches from localStorage or initialize an empty array
  const recentSearchesDiv = document.getElementById("recentSearches"); // Get the recent searches div element
  recentSearchesDiv.innerHTML = ""; // Clear the recent searches div
  if (recentSearches.length > 0) {
    // Check if there are any recent searches
    const select = document.createElement("select"); // Create a select element
    select.className = "bg-red-300 text-white rounded-md px-3 py-1 shadow-md"; // Set class for styling
    select.addEventListener("change", function () {
      getWeatherData(this.value); // Fetch weather data for the selected city when the selection changes
    });
    select.innerHTML = `<option value="">Recent Searches</option>`; // Add a default option
    recentSearches.forEach((city) => {
      // Loop through recent searches
      select.innerHTML += `<option value="${city}">${city}</option>`; // Add each city as an option
    });
    recentSearchesDiv.appendChild(select); // Add the select element to the recent searches div
  }
}

// Initialize recent searches dropdown on page load
document.addEventListener("DOMContentLoaded", updateRecentSearchesDropdown);
