// role.js (roleModel)

const connection = require('../config/connection');

function getAll(callback) {
    const sql = 'SELECT role.id AS roleId, role.title, role.salary, department.id AS departmentId, department.name AS departmentName FROM role JOIN department ON role.department_id = department.id';
  
    connection.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}
function add(roleData, callback) {
  const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  const values = [roleData.role_name, roleData.salary, roleData.department];

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
