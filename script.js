$(document).ready(function () {
  // Declare variables
  let dateEl = $("#date");
  let timeEl = $("#time");
  let todayEl = $("#today");
  let forecastEl = $("#forecast");
  let historyEl = $("#history");

  let APIKey = "cdff13d48c1ee8584b1173383a7f5341";

  let city;
  let currentURL;

  function setDay() {
    dateEl.text(dayjs().format("dddd, MMMM D, YYYY"));
    timeEl.text(dayjs().format("h:mm A"));
  }

  function weatherApiCall() {
    currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    fetch(currentqueryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayCurrentWeather(data);
      });
  }

  function displayCurrentWeather(data) {
    $("#today").empty();
    let icon = data.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    let wind = data.wind.speed;
    let tempC = (temp - 273.15).toFixed(2);

    let todayWeather = $("<div id='todayWeather'>");

    todayWeather.append("<h2 id='city'>" + city + "</h2>");
    todayWeather.append(
      "<div id='date'>" + currentDay.format("dddd, MMMM D, YYYY") + "</div>"
    );
    todayWeather.append("<div id='icon'><img src=" + iconURL + "></div>");
    todayWeather.append("<div id='temp'>Temperature: " + tempC + "°C</div>");
    todayWeather.append("<div id='humidity'>Humidity: " + humidity + "%</div>");
    todayWeather.append("<div id='wind'>Wind Speed: " + wind + "MPH</div>");

    $("#today").append(todayWeather);
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

      getWeather();
      getForecast();
    }
  });

  setDay();
});
