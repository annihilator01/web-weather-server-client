module.exports = ({router, actions, models}) => {
    const routes = router();
    const favorite = actions.favorite(models);

    routes.get('/', async (req, res) => {
        const favorites = await favorite.getAll();
        res.send(favorites);
    });

    routes.post('/', async (req, res) => {
        const target = await favorite.add(req.body.payload);
        res.send(target);
    });

    routes.delete('/', async (req, res) => {
        const target = await favorite.delete(req.body.payload);
        res.send(target);
    });

    return routes;
}