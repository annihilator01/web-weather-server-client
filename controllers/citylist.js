const fs = require('fs');
const path = require("path");

module.exports = ({router}) => {
    const routes = router();

    routes.get('/', async (req, res) => {
        const cityListPath = path.resolve(__dirname, '../data/city_list.json');
        fs.readFile(cityListPath, 'utf8', (err, data) => {
            if (err) throw err;

            const seen = new Set();
            data = JSON.parse(data).map(city => city.name);
            data = data.filter(city => {
               const isDuplicateCity = seen.has(city);
               seen.add(city);
               return !isDuplicateCity;
            });

            res.send(data);
        });
    });

    return routes;
}