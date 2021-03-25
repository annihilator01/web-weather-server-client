document.addEventListener('DOMContentLoaded', async () => {
    popupBadInternetInit();
    fillFavoriteWithDataInit();
    addFavoriteCityInit();
    updateGeolocationInit();
    autocompleteAddFormInit();
    autocompleteInformationInit();
    removeAllBubbleErrorsOnDocumentClickInit();
});

const badInternetPopup = document.querySelector('.bad-internet');
const badInternetReloadButton = document.querySelector('.bad-internet__reload-button');
function popupBadInternetInit() {
    badInternetReloadButton.addEventListener('click', event => {
        window.location.reload();
    });
}

function fillFavoriteWithDataInit() {
    fetch('/favorite')
        .then(response => response.json())
        .then(onLoadCities => {
            for (const city of onLoadCities) {
                addFavItem(city.name, true).then();
            }
        })
        .catch(err => {
            showBadInternetPopup();
        });
}

const addButton = document.querySelector('.add-form__submit-button');
const addForm = document.querySelector('.add-form__autocomplete');
function addFavoriteCityInit() {
    addButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const city = addInput.value.trim();
        if (!city) {
            return;
        }

        addFavItem(city)
            .then(() => {
                addInput.value = '';
                addInput.blur();
            })
            .catch(err => {
                insertBubbleError(addForm, err);
            });
    });
}

const updateGeolocationButton = document.querySelector('.default__upd-geo-btn');
function updateGeolocationInit() {
    // connect update geolocation button with function
    updateGeolocationButton.addEventListener('click', event => {
        updateGeolocation();
    });

    // update geolocation on load
    updateGeolocation();

}


const defaultCityCoords = {
    'lon': 37.615555,
    'lat': 55.75222
};
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


const addInput = document.querySelector('.add-form__input');
const autocompleteList = document.querySelector('.add-form__autocomplete-list');
let focusElementIndex = -1;
function autocompleteAddFormInit () {
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
            } else {
                addButton.click();
            }
        }
    });
}

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

let cityList;
function autocompleteInformationInit() {
    document.addEventListener('click', event => {
        removeAutocompleteItems();
    });


    addInput.addEventListener('input', event => {
        focusElementIndex = -1;
        const inputText = event.target.value.trim();

        removeAutocompleteItems();
        removeBubbleErrors();

        if (inputText.length === 0) {
            return;
        }

        fetch(`/citylist?prefix=${inputText}`)
            .then(response => response.json())
            .then(matches => {
                console.log(matches);
                if (matches.length !== 0) {
                    autocompleteList.classList.remove('display-none');
                }

                for (const match of matches) {
                    let autocompleteItem = getAutocompleteItem(match, inputText.length);
                    autocompleteItem.addEventListener('click', event => {
                        addInput.value = `${match}`;
                        removeAutocompleteItems();
                    });
                    autocompleteList.appendChild(autocompleteItem);
                }
            })
            .then(err => {});
    });
}

function removeAutocompleteItems() {
    autocompleteList.querySelectorAll('*').forEach(item => item.remove());
}

function removeAllBubbleErrorsOnDocumentClickInit() {
    document.addEventListener('click', event => {
        removeBubbleErrors();
    });
}