let apiKey = "&appid=df40e453f18e8b1150a67320b38cc787";

let currentDay = moment().format(" D/ M/ Y");
let nextDay = moment().add(1, "days").format(" D/ M/ YY");
let thirdDay = moment().add(2, "days").format(" D/ M/ YY");
let fourthDay = moment().add(3, "days").format(" D/ M/ YY");
let fifthday = moment().add(4, "days").format(" D/ M/ YY");
let sixthDay = moment().add(5, "days").format(" D/ M/ YY");

let savedInputs = [];
let mySearchHistory = localStorage.getItem("searchHistroy");

function renderList() {
    // clear out the unordered list to prevent items from repeating
    $(".search-history").empty();

    // create a for loop to create a newlist everytime the user searches for a city
    for (let i = 0; i < savedInputs.length; i++) {
        let listDiv = $("<button class= 'dynamic-btn'>").attr("index", i);
        listDiv.html(savedInputs[i]);
        $(".search-history").append(listDiv);
    }
}

// adding an event listener to the search button
$("#search").on("click", function (event) {
    event.preventDefault();
    //grab input result from search field
    let newList = $("#searchinput").val().trim();
    //push the input result to create a new list
    savedInputs.push(newList);

    // save searched input to the local storage
    localStorage.setItem("searchHistroy", JSON.stringify(savedInputs))
    //call the render list function
    renderList();
    getLatLon(newList);
    foreHeader()
});

// lets get the value of the search history
$("body").on("click", ".search-history button", function (event) {
    event.preventDefault();
    let searchValue = $(this).text();
    getLatLon(searchValue);
})

// this function will get value of the city from the click button and get the coordinates from the api
function getLatLon(cityName) {
    let queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        getCoordObjects(response.coord.lat, response.coord.lon, cityName);
    });
}

// this function will grab the values of the lat and long to give us the objects we need from the api
function getCoordObjects(x, y, name) {
    let queryURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        x +
        "&lon=" +
        y +
        apiKey;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        displayWeatherInfo(response, name);
        day1Div(response);
        day2Div(response);
        day3Div(response);
        day4Div(response);
        day5Div(response);
    });
}

// This function will display the current weather of the city
function displayWeatherInfo(object, displayName) {
    $("#weather-results").empty();
    let weatherDiv = $("#weather-results");
    // create H2 element to hold the city name
    let nameEl = $("<h2>");
    nameEl.text(displayName);
    let img = $("<img>");
    let day1IconSrc = "http://openweathermap.org/img/w/" + object.current.weather[0].icon + ".png";
    img.attr("src", day1IconSrc);
    nameEl.append(currentDay, img);
    let tempF = (object.current.temp - 273.15) * 1.8 + 32;
    //create an p tag to how the temp
    let temP = $("<p>");
    temP.text("Temperature (F): " + tempF.toFixed(2));
    // get humidity
    let hum = $("<p>");
    hum.text("Humidty: " + object.current.humidity + "%");
    //get wind speed
    let windSpeed = $("<p>");
    windSpeed.text("Wind Speed: " + object.current.wind_speed + " MPH");
    weatherDiv.append(windSpeed);
    // get UV index
    let uvIndex = $("<p>");
    uvIndex.text("UV Index:");
    let spanIndex = $("<span>");
    let spanVal = object.current.uvi;
    spanIndex.text(spanVal);
    
    if (spanVal < 3) {
        spanIndex.addClass("green");
    } 
    else if (spanVal < 6) {
        spanIndex.addClass("yellow");
    } 
    else if (spanVal < 8) {
        spanIndex.addClass("orange");
    }
     else {
        spanIndex.addClass("red");
    }
    uvIndex.append(spanIndex);
    //append the all the created elements to their parent div
    weatherDiv.append(nameEl, temP, hum, windSpeed, uvIndex);
}

// function holding the forecast header
function foreHeader() {
    $("#forecast-header").empty();
    let foreCastHeader = $("<h5>");
    foreCastHeader.text("5-Day Forecast:");
    $("#forecast-header").append(foreCastHeader);
    
}

function day1Div(object) {
    $("#five-days-forcast").empty();
    // create Day one div
    let div = $("<div class= 'col-md-2 future-forecast'>");
    let date = $("<p>");
    date.text(nextDay);
    let img = $("<img>");
    let day1IconSrc = "http://openweathermap.org/img/w/" + object.daily[1].weather[0].icon + ".png";
    img.attr("src", day1IconSrc);
    let temP = $("<p>");
    let tempF = (object.daily[1].temp.day - 273.15) * 1.8 + 32;
    temP.text("Temperature (F): " + tempF.toFixed(2));
    let humidity = $("<p>");
    humidity.text("Humidty: " + object.daily[0].humidity + "%");
    div.append(date, img, temP, humidity);
    $("#five-days-forcast").append(div);
}

function day2Div(object) {
    // create day 2 div
    let div = $("<div class= 'col-md-2 future-forecast'>");
    let date = $("<p>");
    date.text(thirdDay);
    let img = $("<img>");
    let iconSrc = "http://openweathermap.org/img/w/" + object.daily[2].weather[0].icon + ".png";
    img.attr("src", iconSrc);
    let temP = $("<p>");
    let tempF = (object.daily[2].temp.day - 273.15) * 1.8 + 32;
    temP.text("Temperature (F): " + tempF.toFixed(2));
    let humidity = $("<p>");
    humidity.text("Humidty: " + object.daily[1].humidity + "%");
    div.append(date, img, temP, humidity);
    $("#five-days-forcast").append(div);
}

function day3Div(object) {
    //create day 3 div
    let div = $("<div class= 'col-md-2 future-forecast'>");
    let date = $("<p>");
    date.text(fourthDay);
    let img = $("<img>");
    let iconSrc = "http://openweathermap.org/img/w/" + object.daily[3].weather[0].icon + ".png";
    img.attr("src", iconSrc);
    let temP = $("<p>");
    let tempF = (object.daily[3].temp.day - 273.15) * 1.8 + 32;
    temP.text("Temperature (F): " + tempF.toFixed(2));
    let humidity = $("<p>");
    humidity.text("Humidty: " + object.daily[2].humidity + "%");
    div.append(date, img, temP, humidity);
    $("#five-days-forcast").append(div);
}

function day4Div(object) {
    let div = $("<div class= 'col-md-2 future-forecast'>");
    let date = $("<p>");
    date.text(fifthday);
    let img = $("<img>");
    let iconSrc = "http://openweathermap.org/img/w/" + object.daily[4].weather[0].icon + ".png";
    img.attr("src", iconSrc);
    let temP = $("<p>");
    let tempF = (object.daily[4].temp.day - 273.15) * 1.8 + 32;
    temP.text("Temperature (F): " + tempF.toFixed(2));
    let humidity = $("<p>");
    humidity.text("Humidty: " + object.daily[3].humidity + "%");
    div.append(date, img, temP, humidity);
    $("#five-days-forcast").append(div);
}

function day5Div(object) {
    let div = $("<div class= 'col-md-2 future-forecast'>");
    let date = $("<p>");
    date.text(sixthDay);
    let img = $("<img>");
    let iconSrc = "http://openweathermap.org/img/w/" + object.daily[5].weather[0].icon + ".png";
    img.attr("src", iconSrc);
    let temP = $("<p>");
    let tempF = (object.daily[5].temp.day - 273.15) * 1.8 + 32;
    temP.text("Temperature (F): " + tempF.toFixed(2));
    let humidity = $("<p>");
    humidity.text("Humidty: " + object.daily[4].humidity + "%");
    div.append(date, img, temP, humidity);
    $("#five-days-forcast").append(div);
}