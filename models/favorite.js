const {db, Sequelize} = require("../db/connection");

const model = db.define('favorite', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },

    name: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'favorite'
});

db.sync();
module.exports = {model};
