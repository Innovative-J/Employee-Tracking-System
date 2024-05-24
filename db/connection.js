// creating sql connection to the db
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: "/",
  password: " ",
  database: "employee_tracker_db"

});

module.exports = db;