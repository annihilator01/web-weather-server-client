const {db} = require("../db/connection");

const createTableQuery = `CREATE TABLE IF NOT EXISTS favorite (
                            id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
                            name TEXT NOT NULL
                          )`;
const addRowQuery = `INSERT INTO favorite (
                        name
                     )
                     VALUES (?)`;
const deleteRowQuery = `DELETE FROM favorite
                        WHERE name = ?`;
const getAllRowsQuery = `SELECT name FROM favorite`;


db.run(createTableQuery);

const model = {
    add: ({name}) => {
        return new Promise(resolve => {
            db.run(addRowQuery, [name], () => {
                resolve({name: name});
            });
        });
    },

    delete: ({name}) => {
        return new Promise(resolve => {
            db.run(deleteRowQuery, [name], () => {
                resolve({name: name});
            });
        });
    },

    getAll: () => {
        return new Promise(resolve => {
            db.all(getAllRowsQuery, (err, rows) => {
                resolve(rows);
            });
        });
    }
}

module.exports = {model};
