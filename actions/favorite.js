const config = require('../config');

module.exports = ({favorite}) => ({
    add: (payload) => {
        const {name} = payload;
        return new Promise((resolve, reject) => {
            favorite.model.count()
                .then(totalCount => {
                    if (totalCount >= config.maxFavoriteCities) {
                        reject(`Cannot add new city, max number: ${config.maxFavoriteCities}`);
                        return;
                    }

                    const isNameUniquePromise = module.exports({favorite}).isNameUnique(name);
                    isNameUniquePromise
                        .then(count => {
                            if (count !== 0) {
                                reject(`City with such name already exists: ${name}`);
                                return;
                            }

                            resolve(favorite.model.create({
                                name: name
                            }));
                        });
                });
        });
    },

    isNameUnique: (name) => {
        return favorite.model.count({where: {name: name}});
    },

    delete: (payload) => {
        const {name} = payload;
        return favorite.model.destroy({where: {name: name}});
    },

    getAll: ({attributes}) => {
        return favorite.model.findAll({attributes: attributes});
    }
});