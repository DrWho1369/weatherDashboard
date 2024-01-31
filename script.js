// Initial setup when the document is ready
$(document).ready(function () {
  // Variables Decleration
  let dateEl = $("#date");
  let timeEl = $("#time");
  let todayEl = $("#today");
  let forecastEl = $("#forecast");
  let historyEl = $("#history");
  let APIKey = "cdff13d48c1ee8584b1173383a7f5341";
  let city;
  let currentURL;
  let todayContainer = $("#today");
  // Function to set the current date and time
  function setDay() {
    dateEl.text(dayjs().format("dddd, MMMM D, YYYY"));
    timeEl.text(dayjs().format("h:mm A"));
  }

  function weatherApiCall() {
    currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    fetchAndDisplay(currentURL, displayCurrentWeather);
  }

  function forecastApiCall() {
    currentURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
    fetchAndDisplay(currentURL, showForecast);
  }

  function fetchAndDisplay(url, callback) {
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        callback(data);
      });
  }

  function displayCurrentWeather(data) {
    todayContainer.empty();
    let icon = data.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    let humidity = data.main.humidity;
    let wind = data.wind.speed;
    let tempC = (data.main.temp - 273.15).toFixed(2);

    let todayWeather = `
    <div id='todayWeather'>
      <h2 id='city'>${city}</h2>
      <div id='date'>${dayjs().format("dddd, MMMM D, YYYY")}</div>
      <div id='icon'><img src="${iconURL}"></div>
      <div id='temp'>Temperature: ${tempC}°C</div>
      <div id='humidity'>Humidity: ${humidity}%</div>
      <div id='wind'>Wind Speed: ${wind}MPH</div>
    </div>
  `;
    todayContainer.append(todayWeather);
  }

  function showForecast(data) {
    const forecast = $("#forecast").empty();
    forecast.append("<h5 id='header5Day'>5 Day Forecast: </h5>");

    for (let i = 7; i <= 39; i += 8) {
      const { dt_txt, weather, main } = data.list[i];
      const iconURL = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      const tempC = (main.temp - 273.15).toFixed(2);

      const forecastDay = $(`
            <div class='forecastDay'>
                <div class='date'>${dt_txt}</div>
                <div class='icon'><img src=${iconURL}></div>
                <div class='temp'>Temperature: ${tempC}°C</div>
                <div class='humidity'>Humidity: ${main.humidity}%</div>
            </div>
        `);

      forecast.append(forecastDay);
    }
  }

  function displayHistory() {
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    $("#history").empty();
    for (let i = 0; i < history.length; i++) {
      let historyButton = $("<button class='historyButton'>");
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
    event.preventDefault();
    city = $(event.target).text();
    weatherApiCall();
    forecastApiCall();
  });

  // Call code to set the initial day and display search history on page load
  setDay();
  displayHistory();
});
