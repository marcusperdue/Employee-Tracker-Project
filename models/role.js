const connection = require('../config/connection');

module.exports = {
    getAllRoles: function(callback) {
        connection.query('SELECT * FROM role', callback);
    },
   
};
