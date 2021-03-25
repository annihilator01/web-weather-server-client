module.exports = ({router, actions}) => {
    const routes = router();
    const citylist = actions.citylist();

    routes.get('/', async (req, res) => {
        const prefix = req.query.prefix.trim();

        if (prefix) {
            res.send(citylist.getCitiesStartWith(prefix));
        } else {
            res.send(citylist.getAllCities());
        }
    });

    return routes;
}