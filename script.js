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

  setDay();
});
