const openWeatherApiKey = '788a15215ef681200bb352db9f04f8c3';
const defaultItem = document.querySelector('.default');
const favItems = document.querySelector('.favorites__items');
const addFormInput = document.querySelector('.add-form__input');

function addFavItem(cityId, cityName) {
    let favItem = document.querySelector('#favorites__item-template').content.cloneNode(true);
    favItem.querySelector('.city-info__name').textContent = cityName;
    const removeButton = favItem.querySelector('.city-weather__remove-button');
    removeButton.addEventListener('click', event => {
        event.preventDefault();
        let cities = JSON.parse(localStorage.getItem(citiesKey));
        cities = cities.filter(city => city.id !== cityId);
        localStorage.setItem(citiesKey, JSON.stringify(cities));
        favItems.removeChild(favItem);
    });

    const dataElements = Array.prototype.concat(
        favItem.querySelector('.city-info__icon'),
        favItem.querySelector('.city-info__temperature'),
        Array.from(favItem.querySelectorAll('.weather-info__value'))
    );
    setSpinner(dataElements);
    favItems.appendChild(favItem);
    favItem = favItems.lastElementChild;

    fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${openWeatherApiKey}`)
        .then(response => response.json())
        .then(data => {
            const
                weatherIcon = favItem.querySelector('.city-info__icon'),
                temperatureVal = favItem.querySelector('.city-info__temperature'),
                windVal = favItem.querySelector('.weather-info__wind'),
                cloudinessVal = favItem.querySelector('.weather-info__cloudiness'),
                pressureVal = favItem.querySelector('.weather-info__pressure'),
                humidityVal = favItem.querySelector('.weather-info__humidity'),
                coords = favItem.querySelector('.weather-info__coords');

            changeSpinnerOnDataNode(weatherIcon, imageNode(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`));
            changeSpinnerOnDataNode(temperatureVal, textNode(`${Math.round(data.main.temp - 273.15)}°C`));
            changeSpinnerOnDataNode(windVal, textNode(`${data.wind.speed} meter/sec, ${windSpeedToBeaufortScale(data.wind.speed)}, ${degToDirection(data.wind.deg)}`));
            changeSpinnerOnDataNode(cloudinessVal, textNode(`${data.clouds.all}%, ${cloudinessToCondition(data.clouds.all)}`));
            changeSpinnerOnDataNode(pressureVal, textNode(`${data.main.pressure} hPa`));
            changeSpinnerOnDataNode(humidityVal, textNode(`${data.main.humidity}%`));
            changeSpinnerOnDataNode(coords, textNode(`[${data.coord.lon}, ${data.coord.lat}]`));
        });
}

function setWeatherHere(cityCoords) {
    const lon = cityCoords.lon;
    const lat = cityCoords.lat;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`)
        .then(response => response.json())
        .then(data => {
            const
                weatherIcon = defaultItem.querySelector('.city-info__icon img'),
                cityVal = defaultItem.querySelector('.city-info__name'),
                temperatureVal = defaultItem.querySelector('.city-info__temperature'),
                windVal = defaultItem.querySelector('.weather-info__wind'),
                cloudinessVal = defaultItem.querySelector('.weather-info__cloudiness'),
                pressureVal = defaultItem.querySelector('.weather-info__pressure'),
                humidityVal = defaultItem.querySelector('.weather-info__humidity'),
                coords = defaultItem.querySelector('.weather-info__coords');

            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            cityVal.textContent = data.name;
            temperatureVal.innerHTML = `${Math.round(data.main.temp - 273.15)}&deg;C`;
            windVal.textContent = `${data.wind.speed} meter/sec, ${windSpeedToBeaufortScale(data.wind.speed)}, ${degToDirection(data.wind.deg)}`;
            cloudinessVal.textContent = `${data.clouds.all}%, ${cloudinessToCondition(data.clouds.all)}`;
            pressureVal.textContent = `${data.main.pressure} hPa`;
            humidityVal.textContent = `${data.main.humidity}%`;
            coords.textContent = `[${data.coord.lon}, ${data.coord.lat}]`;

            const cityWeatherElement = document.querySelector('.city-weather_default');
            removeSpinner(defaultItem);
            cityWeatherElement.classList.remove('display-none');
        });
}