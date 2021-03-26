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
    element.innerHTML = '';
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

function getAutocompleteItem(city, strongLength) {
    const autoCompleteItem = document.createElement('li');
    autoCompleteItem.classList.add('autocomplete-list__item');
    autoCompleteItem.innerHTML = `<strong>${city.slice(0, strongLength)}</strong>${city.slice(strongLength)}`;
    return autoCompleteItem;
}

function getBubbleError(text) {
    const bubbleError = document.createElement('span');
    bubbleError.classList.add('bubble-error', 'bubble-error_top');
    bubbleError.textContent = text;
    return bubbleError;
}

function insertBubbleError(target, text) {
    removeBubbleError(target);
    const bubbleError = getBubbleError(text);
    target.insertAdjacentElement('afterbegin', bubbleError);
}

function removeBubbleErrors() {
    const bubbleErrors = document.querySelectorAll('.bubble-error');
    for (const bubbleError of bubbleErrors) {
        bubbleError.remove();
    }
}

function removeBubbleError(target) {
    const bubbleError = target.querySelector('.bubble-error');
    if (bubbleError) {
        bubbleError.remove();
    }
}

async function fetchSafe(url, init = {}, finalFunction = () => {}) {
    let data;
    try {
        data = await (await fetch(url, init)).json();
    } catch (e) {
        showBadInternetPopup();
    } finally {
        finalFunction();
    }

    return data;
}

function showBadInternetPopup() {
    badInternetPopup.classList.remove('display-none');
    document.querySelector('html').style.overflow = 'hidden';
}

function disableButton(button) {
    button.disabled = true;
}

function enableButton(button) {
    button.disabled = false;
}
