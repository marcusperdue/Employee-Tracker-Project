// / establish a connection to mysql
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'Z@dmin99',  
  database: 'db_project'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);  
    }
    console.log('Connected to the database!');
});

module.exports = connection;
