async function fileToString(filePath) {
    const fetchedData = await fetch(filePath);
    return fetchedData.text();
}

function stringToHTML(string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(string, 'text/html');
    return doc.body.querySelector('*');
}

async function fileToHTML(filePath) {
    const fileString = await fileToString(filePath);
    return stringToHTML(fileString);
}

function getSpinnerIcon() {
    const spinnerIcon = document.createElement('embed');
    spinnerIcon.src = 'img/icons/animated/spinner.svg';
    spinnerIcon.type = 'image/svg+xml';
    spinnerIcon.classList.add('spinner');
    return spinnerIcon;
}

function setSpinner(elements) {
    for (const element of elements) {
        const spinnerIcon = getSpinnerIcon();
        const spinnerBaseClass = element.classList[0];
        spinnerIcon.classList.add(`${spinnerBaseClass}--spinner`);
        element.appendChild(spinnerIcon);
    }
}

function changeSpinnerOnDataNode(element, dataNode) {
    removeSpinner(element);
    element.appendChild(dataNode);
}

function removeSpinner(element) {
    const spinner = element.querySelector('.spinner');
    if (spinner) {
        element.removeChild(spinner);
    }
}

function imageNode(imageSrc) {
    const imageNode = document.createElement('img');
    imageNode.src = imageSrc;
    return imageNode;
}

function textNode(text) {
    return document.createTextNode(text);
}

function replaceAll(string, params){
    const paramsRegexValues = Object.keys(params).join('|').replaceAll('$', '\\$');
    const regex = new RegExp(paramsRegexValues,'g');
    return string.replace(regex, matched => {
        return params[matched];
    });
}

function getAutocompleteItem(city, country, strongLength) {
    const autoCompleteItem = document.createElement('li');
    autoCompleteItem.classList.add('autocomplete-list__item');
    autoCompleteItem.innerHTML = `<strong>${city.slice(0, strongLength)}</strong>${city.slice(strongLength)}`;
    if (country) {
        autoCompleteItem.innerHTML += `, ${country}`
    }

    return autoCompleteItem;
}

const beaufortScale = {
    '0 to 0.4': 'Calm',
    '0.5 to 2.1': 'Light cir',
    '2.2 to 3.6': 'Light breeze',
    '3.7 to 5.7': 'Gentle breeze',
    '5.8 to 8.8': 'Moderate breeze',
    '8.9 to 11.1': 'Fresh breeze',
    '11.1 to Infinity': 'Strong breeze',
}
function windSpeedToBeaufortScale(windSpeed) {
    for (const windSpeedRange in beaufortScale) {
        let windSpeedLow, windSpeedHigh;
        [windSpeedLow, windSpeedHigh] = windSpeedRange.split(' to ');
        if (windSpeedLow <= windSpeed && windSpeed <= windSpeedHigh) {
            return beaufortScale[windSpeedRange];
        }
    }
}

const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
function degToDirection(deg) {
    if (deg < 0) {
        deg = Math.ceil(Math.abs(deg / 360)) * 360 + deg;
    }

    const val = Math.floor((deg / 22.5) + .5)
    return directions[(val % 16)];
}

const skyConditions = {
    '0 to 5': 'Clear',
    '6 to 25': 'Mostly clear',
    '26 to 50': 'Partly cloudy',
    '51 to 69': 'Mostly cloudy',
    '70 to 87': 'Considerable cloudiness',
    '88 to 100': 'Overcast'
}
function cloudinessToCondition(cloudiness) {
    cloudiness = Math.round(cloudiness);
    for (const cloudinessRange in skyConditions) {
        let cloudinessLow, cloudinessHigh;
        [cloudinessLow, cloudinessHigh] = cloudinessRange.split(' to ');
        if (cloudinessLow <= cloudiness && cloudiness <= cloudinessHigh) {
            return skyConditions[cloudinessRange];
        }
    }
}