const connection = require('../config/connection');

function getAll(callback) {
  const sql = `
    SELECT
      e.id AS employee_id,
      e.first_name,
      e.last_name,
      r.title,
      d.name AS department,
      r.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM
      employee e
    LEFT JOIN
      role r ON e.role_id = r.id
    LEFT JOIN
      department d ON r.department_id = d.id
    LEFT JOIN
      employee m ON e.manager_id = m.id;
  `;

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
 



