var searchButtonEl = $("#search-button");
var textInput = "";

//   Get the value of the text input
function getTextInput() {
  textInput = $("#search-input").val();
}

// call the api key with this value as the location
function callApi() {}

// Return the relevant information in the main section div
// todday api call in today
// store the name as a new button in the aside that can call this function

searchButtonEl.on("click", function () {
  console.log("clicked");
  getTextInput();
  callApi();
});
