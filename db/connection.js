const config = require('../config');

const Sequelize = require('sequelize');
const db = new Sequelize(config.dbName, null, null, {
    dialect: 'sqlite',
    storage: config.dbPath
});



module.exports = {db, Sequelize};