// State
let currCity = "London";
let units = "metric";

// Selectors
const city = document.querySelector(".weather__city");
const datetime = document.querySelector(".weather__datetime");
const weather__forecast = document.querySelector(".weather__forecast");
const weather__temperature = document.querySelector(".weather__temperature");
const weather__icon = document.querySelector(".weather__icon");
const weather__minmax = document.querySelector(".weather__minmax");
const weather__realfeel = document.querySelector(".weather__realfeel");
const weather__humidity = document.querySelector(".weather__humidity");
const weather__wind = document.querySelector(".weather__wind");
const weather__pressure = document.querySelector(".weather__pressure");
const hourlyForecastDiv = document.querySelector(".weather__hourly-forecast");

// Search
document
  .querySelector(".weather__search")
  .addEventListener("submit", (event) => {
    const searchInput = document.querySelector(".weather__searchform");

    // Prevent the default form submission
    event.preventDefault();

    // Update the current city
    currCity = searchInput.value;

    // Fetch weather forecast for the new city
    getWeather();
    // Fetch hourly forecast for the new city
    getHourlyForecast();

    // Clear the search form
    searchInput.value = "";
  });

// Units
document
  .querySelector(".weather_unit_celsius")
  .addEventListener("click", () => {
    if (units !== "metric") {
      // Change to metric units
      units = "metric";

      // Fetch weather forecast with updated units
      getWeather();
    }
  });

document
  .querySelector(".weather_unit_fahrenheit")
  .addEventListener("click", () => {
    if (units !== "imperial") {
      // Change to imperial units
      units = "imperial";

      // Fetch weather forecast with updated units
      getWeather();
    }
  });

// Function to convert country code to region name
function convertCountryCode(country) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  return regionNames.of(country);
}

// Function to fetch and display weather information
function getWeather() {
  // Replace 'your_api_key' with your actual OpenWeatherMap API key
  const API_KEY = "b6f26a79ca773edd8d370c7c132cac30";

  // Fetch weather data based on the current city and units
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`
  )
    .then((res) => res.json())
    .then((data) => {
      // Log the retrieved data for debugging purposes
      console.log(data);

      // Update HTML elements with weather information
      city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
      weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
      weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
      weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
      weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
      weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
      weather__humidity.innerHTML = `${data.main.humidity}%`;

      // Display wind speed in the appropriate unit (mph or m/s)
      weather__wind.innerHTML = `${data.wind.speed} ${
        units === "imperial" ? "mph" : "m/s"
      }`;

      weather__pressure.innerHTML = `${data.main.pressure} hPa`;
    })
    .catch((error) => {
      // Handle errors in the fetch request
      console.error("Error fetching weather data:", error);
    });
}

// Function to fetch and display hourly forecast information
function getHourlyForecast() {
  // Replace 'your_api_key' with your actual OpenWeatherMap API key
  const API_KEY = "b6f26a79ca773edd8d370c7c132cac30";

  // Fetch hourly forecast data based on the current city and units
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&appid=${API_KEY}&units=${units}`
  )
    .then((res) => res.json())
    .then((data) => {
      // Log the retrieved data for debugging purposes
      console.log(data);

      // Display hourly forecast
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      // Handle errors in the fetch request
      console.error("Error fetching hourly forecast data:", error);
    });
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
  hourlyForecastDiv.innerHTML = ""; // Clear previous content

  const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const hourlyItemHtml = `
      <div class="hourly-item">
          <span>${hour}:00</span>
          <img src="${iconUrl}" alt="Hourly Weather Icon">
          <span>${temperature}°C</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

// Fetch weather and hourly forecast information on page load
document.addEventListener("DOMContentLoaded", () => {
  getWeather();
  getHourlyForecast();
});
