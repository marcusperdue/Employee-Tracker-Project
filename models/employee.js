const connection = require('../config/connection');

module.exports = {
    getAllEmployees: function(callback) {
        connection.query('SELECT * FROM employee', callback);
    },
     
};

exports.add = function(employeeDetails, callback) {
    connection.query('INSERT INTO employee SET ?', employeeDetails, callback);
};