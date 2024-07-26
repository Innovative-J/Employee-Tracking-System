// creating sql connection to the db
const { Pool } = require("pg");

const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "2137179Jr",
  database: "employee_tracker_db",
});

module.exports = db;
