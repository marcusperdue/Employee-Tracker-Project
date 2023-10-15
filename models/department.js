const connection = require('../config/connection');

module.exports = {
    getAllDepartments: function(callback) {
        connection.query('SELECT * FROM department', callback);
    },
  
};
