//Show previous weather
const showPreviousWeatherElement = document.querySelector(
  "#show-previous-weather"
);
showPreviousWeatherElement.onclick = function (e) {
  const previousWeatherElement = document.querySelector("#previous-weather");
  previousWeatherElement.classList.toggle("show-weather");
};

//----------------------------------------------------------------
//Document for this API: https://api.nasa.gov/assets/insight/InSight%20Weather%20API%20Documentation.pdf
const API_URL = `https://mars.nasa.gov/rss/api/?feed=weather&category=insight_temperature&feedtype=json&ver=1.0`;
//Get elements
const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHighElement = document.querySelector(
  "[data-current-temp-high]"
);
const currentTempLowElement = document.querySelector("[data-current-temp-low]");
const currentWindSpeedElement = document.querySelector(
  "[data-current-wind-speed]"
);

const previousWeatherListElement = document.querySelector(
  "[data-previous-sols]"
);
const previousWeatherTemplate = document.querySelector(
  "[data-previous-sol-template]"
);

const unitToggleElement = document.querySelector("[data-unit-toggle");

//Main

getWeather().then((sols) => {
  //display the latest sol
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);

  //display previous sols
  displayPreviousSols(sols);

  //update unit
  updateUnit();

  //--Change unit ᴼC => ᴼF
  unitToggleElement.onchange = function () {
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnit();
  };
});

//Functions
//--Get API
function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      //split data into smaller parts
      const { sol_keys, validity_checks, ...solData } = data;
      //get the values which we want
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          date: new Date(data.First_UTC),
        };
      });
    });
}

//--Display selected sol
function displaySelectedSol(sols) {
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.textContent = selectedSol.sol;
  currentDateElement.textContent = customDate(selectedSol.date, dateOptions);
  currentTempHighElement.textContent = returnTemp(selectedSol.maxTemp).toFixed(
    1
  );
  currentTempLowElement.textContent = returnTemp(selectedSol.minTemp).toFixed(
    1
  );
  currentWindSpeedElement.textContent = returnSpeed(
    selectedSol.windSpeed
  ).toFixed(2);
}

//--Display previous sols
function displayPreviousSols(sols) {
  const dateOptions = {
    month: "long",
    day: "numeric",
  };
  //reset previous weather list
  previousWeatherListElement.innerHTML = "";
  //add elements
  sols.forEach((sol, index) => {
    const solClone = previousWeatherTemplate.content.cloneNode(true);
    solClone.querySelector("[data-sol]").textContent = sol.sol;
    solClone.querySelector("[data-date]").textContent = customDate(
      sol.date,
      dateOptions
    );
    solClone.querySelector("[data-temp-high]").textContent = returnTemp(
      sol.maxTemp
    ).toFixed();
    solClone.querySelector("[data-temp-low]").textContent = returnTemp(
      sol.minTemp
    ).toFixed();
    solClone.querySelector("[data-more-info-btn]").onclick = () => {
      selectedSolIndex = index;
      displaySelectedSol(sols);
    };
    previousWeatherListElement.appendChild(solClone);
  });
}

//--toString sol.date
function customDate(date, options) {
  return date.toLocaleDateString(undefined, options);
}

//--convert cel to fah
function returnTemp(cel) {
  return isCheckedUnitToggle() ? cel * 1.8 + 32 : cel;
}

//--convert m/s to km/h
function returnSpeed(ms) {
  return isCheckedUnitToggle() ? ms * (5 / 18) : ms;
}

//--Update unit
function updateUnit() {
  //get elements
  const tempUnitElements = document.querySelectorAll("[data-temp-unit]");
  const windUnitElements = document.querySelectorAll("[data-wind-unit]");

  tempUnitElements.forEach((element) => {
    element.textContent = isCheckedUnitToggle() ? "F" : "C";
  });

  windUnitElements.forEach((element) => {
    element.textContent = isCheckedUnitToggle() ? "km/h" : "m/s";
  });
}

//isChecked == false => the unit is cel, otherwise it's fah
function isCheckedUnitToggle() {
  return unitToggleElement.checked;
}
