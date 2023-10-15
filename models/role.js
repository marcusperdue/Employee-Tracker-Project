const connection = require('../config/connection'); // Adjust the path as needed

function getAll(callback) {
  const sql = 'SELECT * FROM role';

  connection.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
}

module.exports = {
  getAll,
};
