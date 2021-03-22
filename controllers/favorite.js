utils = require('../utils');

module.exports = ({router, actions, models}) => {
    const routes = router();
    const favorite = actions.favorite(models);

    routes.get('/', async (req, res) => {
        const favorites = await favorite.getAll({attributes: ['name']});
        res.send(favorites);
    });

    routes.post('/', async (req, res) => {
        favorite.add(req.body.payload)
            .then(instance => instance.dataValues)
            .then(target => {
                target = utils.filterDict(target, ['id', 'name']);
                target.code = 200;
                res.send(target);
            })
            .catch(err => {
                res.status(403).send({
                    code: 403,
                    message: err
                });
            });
    });

    routes.delete('/', async (req, res) => {
        await favorite.delete(req.body.payload);
        res.sendStatus(200);
    });

    return routes;
}