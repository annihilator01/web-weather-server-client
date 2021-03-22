const isDevMode = true;

exports.port = isDevMode ? 3000 : 80;
exports.dbName = isDevMode ? 'weather_dev' : 'weather';
exports.dbPath = `${__dirname}/db/${exports.dbName}.sqlite`;
exports.maxFavoriteCities = 10;

const openWeatherApiKey = '788a15215ef681200bb352db9f04f8c3';
exports.weatherByLocationURL = `https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=${openWeatherApiKey}`;
exports.weatherByCityURL = `https://api.openweathermap.org/data/2.5/weather?q=$city&appid=${openWeatherApiKey}`;

