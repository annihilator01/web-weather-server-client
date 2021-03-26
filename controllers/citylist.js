module.exports = ({router, actions}) => {
    const routes = router();
    const citylist = actions.citylist();

    routes.get('/', async (req, res) => {
        const prefix = req.query.prefix;

        switch (prefix) {
            case '':
                res.send([]);
                break;
            case undefined:
                res.send(citylist.getAllCities());
                break;
            default:
                res.send(citylist.getCitiesStartWith(prefix.trim()));
                break;
        }
    });

    return routes;
}