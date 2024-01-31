// Initial setup when the document is ready
$(document).ready(function () {
  // Variables Decleration
  let dateEl = $("#date");
  let timeEl = $("#time");
  let forecast = $("#forecast");
  let APIKey = "cdff13d48c1ee8584b1173383a7f5341";
  let city;
  let currentURL;
  let todayContainer = $("#today");

  function setDay() {
    /**
     * The setDay function sets the text of two elements to the current date and time in a specific format
     * using the dayjs library.
     */
    dateEl.text(dayjs().format("dddd, MMMM D, YYYY"));
    timeEl.text(dayjs().format("h:mm A"));
  }

  function weatherApiCall() {
    /**
     * The function weatherApiCall makes an API call to retrieve the current weather data for a specific
     * city and displays it using the displayCurrentWeather function.
     */
    currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    fetchAndDisplay(currentURL, displayCurrentWeather);
  }

  function forecastApiCall() {
    /**
     * The function `forecastApiCall` makes an API call to retrieve the forecast data for a specific city
     * and displays it using the `showForecast` function.
     */
    currentURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
    fetchAndDisplay(currentURL, showForecast);
  }

  function fetchAndDisplay(url, callback) {
    /**
     * The function fetchAndDisplay takes a URL and a callback function as parameters, fetches data from
     * the URL using the fetch API, converts the response to JSON, and then calls the callback function
     * with the JSON data.
     * param url - The `url` parameter is a string that represents the URL of the resource you want to
     * fetch. It can be a relative or absolute URL.
     * param callback - The callback parameter is a function that will be called with the data retrieved
     * from the URL. It is used to handle the data returned from the fetch request.
     * returns The fetchAndDisplay function does not explicitly return anything.
     */
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        callback(data);
      });
  }

  function displayCurrentWeather(data) {
    /**
     * The function `displayCurrentWeather` takes in weather data and displays the current weather
     * information on a webpage.
     * param data - The `data` parameter is an object that contains the weather information for the
     * current day. It includes properties such as `weather`, `main`, and `wind`, which provide details
     * about the weather conditions, temperature, humidity, and wind speed.
     */
    todayContainer.empty();
    let icon = data.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    let humidity = data.main.humidity;
    let wind = data.wind.speed;
    let tempC = (data.main.temp - 273.15).toFixed(2);

    let todayWeather = `
    <div id='todayWeather'>
      <h2 id='city' class='h1 fw-bold'>${city} ${dayjs().format(
      "DD/MM/YYYY"
    )}<img src="${iconURL}"></h2>
      <div id='date'></div>
      <div id='temp' class='pb-4'>Temperature: ${tempC}°C</div>
      <div id='humidity' class='pb-4'>Humidity: ${humidity}%</div>
      <div id='wind' class='pb-2'>Wind Speed: ${wind}MPH</div>
    </div>
  `;
    todayContainer.append(todayWeather);
  }

  function showForecast(data) {
    /**
     * The function `showForecast` takes in data and displays a 5-day weather forecast on a webpage using
     * the provided data.
     * param data - The `data` parameter is an object that contains the weather forecast data. It is
     * expected to have a property called `list`, which is an array of forecast objects. Each forecast
     * object should have properties such as `dt_txt` (date and time), `weather` (an array of weather
     * conditions
     */
    forecast.empty();
    forecast.append("<h5 id='header5Day'>5 Day Forecast: </h5>");

    for (let i = 7; i <= 39; i += 8) {
      const { dt_txt, weather, main } = data.list[i];
      const iconURL = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      const tempC = (main.temp - 273.15).toFixed(2);

      const forecastDay = $(`
            <div class='forecastDay col'>
                <div class='date fw-bold'>${dt_txt}</div>
                <div class='icon'><img src=${iconURL}></div>
                <div class='temp'>Temperature: ${tempC}°C</div>
                <div class='humidity'>Humidity: ${main.humidity}%</div>
            </div>
        `);

      forecast.append(forecastDay);
    }
  }

  function displayHistory() {
    /**
     * The function "displayHistory" retrieves the city history from local storage, creates buttons for
     * each city, and calls weather and forecast API functions for the first city in the history.
     */
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    $("#history").empty();
    for (let i = 0; i < history.length; i++) {
      let historyButton = $(
        "<button class='historyButton btn btn-outline-secondary mb-2'>"
      );
      historyButton.text(history[i]);
      $("#history").append(historyButton);

      if (history.length > 0) {
        city = history[0];
        weatherApiCall();
        forecastApiCall();
      }
    }
  }

  $("#search-button").on("click", function (event) {
    /* The code block is an event listener that is triggered when the search button is clicked. It
 prevents the default form submission behavior, retrieves the value entered in the search input
 field, and performs the following actions: */
    event.preventDefault();
    city = $("#search-input").val();
    if (city.trim() !== "") {
      let history = JSON.parse(localStorage.getItem("cities")) || []; //
      if (!history.includes(city)) {
        history.unshift(city);
        const maxHistory = 5;
        if (history.length > maxHistory) {
          history.pop();
        }
        localStorage.setItem("cities", JSON.stringify(history));
      }

      displayHistory();

      weatherApiCall();
      forecastApiCall();
    }
  });

  $("#history").on("click", ".historyButton", function (event) {
    /* The code `$("#history").on("click", ".historyButton", function (event) { ... })` is an event
  listener that is triggered when a button with the class "historyButton" inside the element with
  the id "history" is clicked. */
    event.preventDefault();
    city = $(event.target).text();
    weatherApiCall();
    forecastApiCall();
  });

  // Call code to set the initial day and display search history on page load
  setDay();
  displayHistory();
});
