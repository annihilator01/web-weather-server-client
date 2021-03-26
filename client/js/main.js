const defaultItem = document.querySelector('.default');
const favItems = document.querySelector('.favorites__items');

async function addFavItem(cityName, isInit = false) {
    let favItem = document.querySelector('#favorites__item-template').content.cloneNode(true);
    const removeButton = favItem.querySelector('.city-weather__remove-button');

    const dataElements = Array.prototype.concat(
        favItem.querySelector('.city-info__name'),
        favItem.querySelector('.city-info__icon'),
        favItem.querySelector('.city-info__temperature'),
        Array.from(favItem.querySelectorAll('.weather-info__value'))
    );

    setSpinner(dataElements);
    favItems.appendChild(favItem);
    favItem = favItems.lastElementChild;

    const weatherData = await fetchSafe(`/weather/city?q=${cityName}`);
    if (!weatherData) {
        favItem.remove();
        return;
    }

    switch (weatherData.code) {
        case 200:
            if (isInit) {
                setRemoveFavoriteItemAction(removeButton, favItem, {payload: {name: weatherData.city}});
                fillWeatherItemWithData(favItem, weatherData);
                return;
            }

            const addPayload = {
                payload: {
                    name: weatherData.city
                }
            };

            const dbResponse = await fetchSafe(`/favorite`, {
                    method: 'POST',
                    body: JSON.stringify(addPayload),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            if (!dbResponse) {
                favItem.remove();
                return;
            }

            switch (dbResponse.code) {
                case 200:
                    setRemoveFavoriteItemAction(removeButton, favItem, {payload: {name: weatherData.city}});
                    fillWeatherItemWithData(favItem, weatherData);
                    break;

                case 403:
                    favItem.remove();
                    throw dbResponse.message;
            }
            break;

        case 403:
        case 404:
            favItem.remove();
            throw weatherData.message;
    }
}

function setWeatherHere(cityCoords) {
    const lon = cityCoords.lon;
    const lat = cityCoords.lat;

    fetch(`/weather/coordinates?lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            fillWeatherItemWithData(defaultItem, data);

            const cityWeatherElement = document.querySelector('.city-weather_default');
            removeSpinner(defaultItem);
            cityWeatherElement.classList.remove('display-none');
        })
        .catch(err => {
            showBadInternetPopup();
        });
}

function setRemoveFavoriteItemAction(button, deleteItem, deletePayload) {
    button.addEventListener('click', event => {
        event.preventDefault();

        disableButton(button);
        fetch(`/favorite`, {
            method: 'DELETE',
            body: JSON.stringify(deletePayload),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                favItems.removeChild(deleteItem);
            })
            .catch(err => {
                showBadInternetPopup();
            })
            .finally(() => enableButton(button));
    });
}

function fillWeatherItemWithData(item, data) {
    const
        cityName = item.querySelector('.city-info__name'),
        weatherIcon = item.querySelector('.city-info__icon'),
        temperatureVal = item.querySelector('.city-info__temperature'),
        windVal = item.querySelector('.weather-info__wind'),
        cloudinessVal = item.querySelector('.weather-info__cloudiness'),
        pressureVal = item.querySelector('.weather-info__pressure'),
        humidityVal = item.querySelector('.weather-info__humidity'),
        coords = item.querySelector('.weather-info__coords');

    changeSpinnerOnDataNode(cityName, textNode(data.city));
    changeSpinnerOnDataNode(weatherIcon, imageNode(data.icon));
    changeSpinnerOnDataNode(temperatureVal, textNode(`${Math.round(data.temp)}°C`));
    changeSpinnerOnDataNode(windVal, textNode(`${data.wind.num} meter/sec, ${data.wind.text}, ${data.wind.dir}`));
    changeSpinnerOnDataNode(cloudinessVal, textNode(`${data.clouds.num}%, ${data.clouds.text}`));
    changeSpinnerOnDataNode(pressureVal, textNode(`${data.pressure} hPa`));
    changeSpinnerOnDataNode(humidityVal, textNode(`${data.humidity}%`));
    changeSpinnerOnDataNode(coords, textNode(`[${data.coords.lon}, ${data.coords.lat}]`));
}
