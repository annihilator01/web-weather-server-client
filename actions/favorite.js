module.exports = ({favorite}) => ({
    add: (payload) => {
        return favorite.model.add(payload);
    },

    delete: (payload) => {
        return favorite.model.delete(payload);
    },

    getAll: () => {
        return favorite.model.getAll();
    }
});