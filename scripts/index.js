//Show previous weather
document.querySelector("#show-previous-weather").onclick = function (e) {
  const previousWeatherElement = document.querySelector("#previous-weather");
  previousWeatherElement.classList.toggle("show-weather");
};
