const fs = require('fs');
const path = require('path');

const cities = getAllCities();

function getAllCities() {
    const cityListPath = path.resolve(__dirname, '../data/city_list.json');
    const citiesFromFile = fs.readFileSync(cityListPath, 'utf-8');

    const seen = new Set();
    let cities = JSON.parse(citiesFromFile).map(city => city.name);
    cities = cities.filter(city => {
        const isDuplicateCity = seen.has(city);
        seen.add(city);
        return !isDuplicateCity;
    });

    return cities;
}

module.exports = () => ({
    getCitiesStartWith: (prefix) => {
        prefix = prefix.trim().toLowerCase();

        return cities.filter(
            city => city.toLowerCase().startsWith(prefix)
        ).slice(0, 10);
    },

    getAllCities: () => cities
});