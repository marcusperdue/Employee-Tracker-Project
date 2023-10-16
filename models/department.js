const connection = require('../config/connection');

function getAll(callback) {
    const sql = 'SELECT id, name FROM department';

    connection.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function add(departmentData, callback) {
    const sql = 'INSERT INTO department (name) VALUES (?)';
    const values = [departmentData.name];

    connection.query(sql, values, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

module.exports = {
    getAll,
    add,
};
