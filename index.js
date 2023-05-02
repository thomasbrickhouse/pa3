// https://rapidapi.com/wirefreethought/api/geodb-cities/
// https://rapidapi.com/weatherapi/api/weatherapi-com

const input = document.getElementById("countryLookup");

async function countryNameFunction(countryName) {
  const url =
    "https://wft-geo-db.p.rapidapi.com/v1/geo/countries?namePrefix=" +
    countryName;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/octet-stream",
      "X-RapidAPI-Key": "3375ba92d9msh07a9be7a782e02dp15c8ebjsna7ea602d11e7",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json().then(function (eve) {
      const codes = eve.data;
      document.getElementById("countryOptions").innerHTML = "";
      if (codes.length == 0) {
        console.log("inside");
        const spot = document.getElementById("cityOptions");
        spot.appendChild(document.createTextNode("No results found!"));
      } else {
        clear();
      }
      if (codes.length > 1) {
        for (let i = 0; i < codes.length; i++) {
          city = codes[i];
          countriesButton("countryOptions", city.name, city.code);
        }
      }
      if (codes.length == 1) {
        setTimeout(() => {
          console.log("Delayed for 1 second.");
          getCities(codes[0].code);
        }, "1200");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function getCities(cID) {
  const url =
    "https://wft-geo-db.p.rapidapi.com/v1/geo/countries/" +
    cID +
    "/places?types=CITY&sort=-population";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3375ba92d9msh07a9be7a782e02dp15c8ebjsna7ea602d11e7",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json().then(function (eve) {
      codes = eve.data;
      console.log(codes);
      for (let i = 0; i < codes.length; i++) {
        city = codes[i];
        citiesButton("cityOptions", city);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function getWeather(countryName) {
  const url =
    "https://weatherapi-com.p.rapidapi.com/current.json?q=" + countryName;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3375ba92d9msh07a9be7a782e02dp15c8ebjsna7ea602d11e7",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json().then(function (eve) {
      console.log(eve);
      const location = eve.location;
      const weather = eve.current;
      clickAlert(
        location.name,
        location.localtime,
        location.country,
        weather.feelslike_c,
        weather.feelslike_f,
        weather.wind_mph,
        weather.last_updated
      );
    });
  } catch (error) {
    console.error(error);
  }
}

input.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") {
    clear();
    data = countryLookup.value;
    if (data.length == 0) {
      const spot = document.getElementById("cityOptions");
      spot.appendChild(document.createTextNode("Please enter a country name!"));
    } else {
      countryNameFunction(data);
    }
  }
});

function click_response(cID) {
  clear();
  setTimeout(() => {
    console.log("Delayed for 1 second.");
    getCities(cID);
  }, "1500");
}

function clickAlert(
  city,
  localTime,
  country,
  temp_c,
  temp_f,
  windmph,
  lastUpdated
) {
  if (localTime.length != 16) {
    console.log(localTime.length);
    console.log(localTime.substring(0, 10));
    console.log(localTime.substring(11));
    localTime = localTime.substring(0, 10) + " 0" + localTime.substring(11);
  }

  alert(
    "The current time in " +
      city +
      ", " +
      country +
      " is " +
      convertTime(localTime.substring(11, 16)) +
      ".\n" +
      "Temperature: " +
      temp_f +
      "°F (" +
      temp_c +
      "°C)\n" +
      "Wind Speed: " +
      windmph +
      "mph\n" +
      "Last Updated at: " +
      convertTime(lastUpdated.substring(11, 16))
  );
}

function convertTime(time) {
  const beg = parseInt(time.substring(0, 2), 10);
  if (beg > 12) {
    const string = String(beg - 12);
    return string + time.substring(2) + "PM";
  } else if (beg == 00) {
    return String(beg + 12) + time.substring(2) + "AM";
  } else if (beg == 12) {
    return String(beg) + time.substring(2) + "PM";
  } else {
    return time.substring(1) + "AM";
  }
}

function countriesButton(elementId, insides, code) {
  const buttonEl = document.createElement("button");
  buttonEl.className = "countryButton";
  buttonEl.id = code;
  buttonEl.innerText = insides;
  buttonEl.setAttribute("onclick", "click_response(this.id)");
  document.getElementById(elementId).appendChild(buttonEl);
  console.log("The Countries Button", buttonEl);
}

function citiesButton(elementId, city) {
  const buttonEl = document.createElement("button");
  buttonEl.className = "citiesButton";
  buttonEl.id = city.regionCode;
  const cityName = city.name;
  buttonEl.setAttribute("onclick", "getWeather('" + cityName + "')");
  buttonEl.innerText = city.name;
  document.getElementById(elementId).appendChild(buttonEl);
  console.log("The Cities Button", buttonEl);
}

function clear() {
  document.getElementById("countryOptions").innerHTML = "";
  document.getElementById("cityOptions").innerHTML = "";
}

document.getElementById("countryLookup").oninput = function () {
  document.getElementById("countryOptions").innerHTML = "";
  document.getElementById("cityOptions").innerHTML = "";
};
