const axios = require('axios');
const config = require('../config');

module.exports = ({router, actions}) => {
    const routes = router();
    const weather = actions.weather();

    routes.get('/city', async (req, res) => {
        const city = req.query.q;

        const weatherByCity = encodeURI(config.weatherByCityURL.replace('$city', city));

        if (city.includes(',')) {
            res.status(403).send({
                code: 403,
                message: `Incorrect city name format`
            });
            return;
        }

        axios.get(weatherByCity)
            .then(response => {
                const polishedWeatherData = weather.getPolishedWeatherData(response.data);
                polishedWeatherData.code = 200;
                res.send(polishedWeatherData);
            })
            .catch(err => res.status(404).send({
                code: 404,
                message: `Cannot find city with name: ${city}`
            }));
    });

    routes.get('/coordinates', async (req, res) => {
        const lat = req.query.lat;
        const lon = req.query.lon;

        const weatherByLocation = config.weatherByLocationURL
            .replace('$lat', lat)
            .replace('$lon', lon);

        axios.get(weatherByLocation)
            .then(response => {
                const polishedWeatherData = weather.getPolishedWeatherData(response.data);
                res.send(polishedWeatherData);
            })
            .catch(err => res.status(404).send({
                code: 404,
                message: `Cannot find city with coordinates: lat=${lat}, lon=${lon}`
            }));
    });

    return routes;
}