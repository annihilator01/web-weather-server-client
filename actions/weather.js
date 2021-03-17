const beaufortScale = {
    '0 to 0.4': 'Calm',
    '0.5 to 2.1': 'Light air',
    '2.2 to 3.6': 'Light breeze',
    '3.7 to 5.7': 'Gentle breeze',
    '5.8 to 8.8': 'Moderate breeze',
    '8.9 to 11.1': 'Fresh breeze',
    '11.1 to Infinity': 'Strong breeze',
};
const windSpeedToBeaufortScale = (windSpeed) => {
    for (const windSpeedRange in beaufortScale) {
        let windSpeedLow, windSpeedHigh;
        [windSpeedLow, windSpeedHigh] = windSpeedRange.split(' to ');
        if (windSpeedLow <= windSpeed && windSpeed <= windSpeedHigh) {
            return beaufortScale[windSpeedRange];
        }
    }
};

const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const degToDirection = (deg) => {
    if (deg < 0) {
        deg = Math.ceil(Math.abs(deg / 360)) * 360 + deg;
    }

    const val = Math.floor((deg / 22.5) + .5)
    return directions[(val % 16)];
};

const skyConditions = {
    '0 to 5': 'Clear',
    '6 to 25': 'Mostly clear',
    '26 to 50': 'Partly cloudy',
    '51 to 69': 'Mostly cloudy',
    '70 to 87': 'Considerable cloudiness',
    '88 to 100': 'Overcast'
}
const cloudinessToCondition = (cloudiness) => {
    cloudiness = Math.round(cloudiness);
    for (const cloudinessRange in skyConditions) {
        let cloudinessLow, cloudinessHigh;
        [cloudinessLow, cloudinessHigh] = cloudinessRange.split(' to ');
        if (cloudinessLow <= cloudiness && cloudiness <= cloudinessHigh) {
            return skyConditions[cloudinessRange];
        }
    }
}

module.exports = () => ({
    getPolishedWeatherData: (data) => ({
            city: data.name,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            temp: `${data.main.temp - 273.15}`,
            wind: {
                num: data.wind.speed,
                text: windSpeedToBeaufortScale(data.wind.speed),
                dir: degToDirection(data.wind.deg)
            },
            clouds: {
                num: data.clouds.all,
                text: cloudinessToCondition(data.clouds.all)
            },
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            coords: {
                lat: data.coord.lat,
                lon: data.coord.lon
            }
    })
});