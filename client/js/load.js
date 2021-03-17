const defaultCityCoords = {
    'lon': 37.615555,
    'lat': 55.75222
};

// fill data using local storage
const citiesKey = 'cities'
if (!localStorage.getItem(citiesKey)) {
    localStorage.setItem(citiesKey, '[]');
}
const onLoadCities = JSON.parse(localStorage.getItem(citiesKey));
for (const city of onLoadCities) {
    addFavItem(city.id, city.name);
}

// prevent form from going to beginning of page after submitting
const addButton = document.querySelector('.add-form__submit-button');
addButton.addEventListener('click', event => {
    event.preventDefault();

    const lastTopCity = JSON.parse(localStorage.getItem(lastTopCityKey));
    if (lastTopCity) {
        const cities = JSON.parse(localStorage.getItem(citiesKey));
        const alreadyExistCity = cities.filter(city => city.id === lastTopCity.id);
        if (alreadyExistCity.length === 0) {
            addInput.value = '';
            addInput.blur();
            addFavItem(lastTopCity.id, lastTopCity.name);
            cities.push(lastTopCity);
            localStorage.setItem(citiesKey, JSON.stringify(cities));
        }
    }
});

// connect update geolocation button with function
const updateGeolocationButton = document.querySelector('.default__upd-geo-btn');
updateGeolocationButton.addEventListener('click', event => {
    updateGeolocation();
});

// update geolocation on load
updateGeolocation();

function updateGeolocation() {
    document.querySelector('.city-weather_default').classList.add('display-none');
    setSpinner([document.querySelector('.default')]);

    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(
        position => {
            const cityCoords = {
                'lon': position.coords.longitude,
                'lat': position.coords.latitude
            }
            setWeatherHere(cityCoords);
        },
        positionError => {
            setWeatherHere(defaultCityCoords);
        }
    );
}


// set actions on input to add city form
const addInput = document.querySelector('.add-form__input');
const autocompleteList = document.querySelector('.add-form__autocomplete-list');
const lastTopCityKey = 'lastTopCity';
localStorage.setItem(lastTopCityKey, '');

let focusElementIndex = -1;
addInput.addEventListener('keydown', event => {
    if (event.keyCode === 40) {
        removeAutocompleteActive();
        focusElementIndex++;
        addAutocompleteActive();
    } else if (event.keyCode === 38) {
        removeAutocompleteActive();
        focusElementIndex--;
        addAutocompleteActive();
    } else if (event.keyCode === 13) {
        event.preventDefault();
        if (focusElementIndex !== -1) {
            autocompleteList.children[focusElementIndex].click();
            focusElementIndex = -1;
        } else if (localStorage.getItem(lastTopCityKey)) {
            addButton.click();
        }
    }
});

function addAutocompleteActive() {
    if (focusElementIndex >= autocompleteList.children.length) {
        focusElementIndex = 0;
    } else if (focusElementIndex === -1) {
        focusElementIndex = autocompleteList.children.length - 1;
    }
    autocompleteList.children[focusElementIndex].classList.add('autocomplete-active');
}

function removeAutocompleteActive() {
    if (focusElementIndex !== -1) {
        autocompleteList.children[focusElementIndex].classList.remove('autocomplete-active');
    }
}

fetch('data/city_list.json')
    .then(response => response.json())
    .then(cities => {
        addInput.addEventListener('input', event => {
            const inputText = event.target.value;
            removeAutocompleteItems();

            if (inputText.length === 0) {
                localStorage.setItem(lastTopCityKey, '');
                return;
            }

            let matches = cities.filter(city => city.name.toLowerCase().startsWith(inputText.toLowerCase()));
            const seen = new Set();
            matches = matches.filter(city => {
                const isDuplicateCity = seen.has(city.name);
                seen.add(city.name);
                return !isDuplicateCity;
            }).slice(0, 10);

            if (matches.length !== 0) {
                autocompleteList.classList.remove('display-none');
            }

            for (const match of matches) {
                console.log(match);
                let autocompleteItem = getAutocompleteItem(match.name, match.country, inputText.length);
                autocompleteItem.addEventListener('click', event => {
                    addInput.value = `${match.name}`;
                    if (match.country) {
                        addInput.value += `, ${match.country}`;
                    }

                    const lastTopCity = {
                        id: match.id,
                        name: match.name,
                    };

                    localStorage.setItem(lastTopCityKey, JSON.stringify(lastTopCity));
                    removeAutocompleteItems();
                });
                autocompleteList.appendChild(autocompleteItem);
            }
        })
    });

function removeAutocompleteItems() {
    autocompleteList.querySelectorAll('*').forEach(item => item.remove());
}