const inquirer = require("inquirer");
const db = require("./db/connection");

// Main function for employee tracker
const employee_tracker = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "Log Out",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.choice) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add A Department":
          addDepartment();
          break;
        case "Add A Role":
          addRole();
          break;
        case "Add An Employee":
          addEmployee();
          break;
        case "Update An Employee Role":
          updateEmployeeRole();
          break;
        case "Log Out":
          db.end();
          break;
      }
    });
};

// View All Departments
const viewAllDepartments = () => {
  db.query(`SELECT name FROM department`, (err, result) => {
    if (err) throw err;
    console.log("Viewing All Departments:");
    // console.log(result.rows);
    result.rows.forEach((department) => console.log(department.name));
    employee_tracker();
  });
};
// copy this for the rest of the options 





//   same for this one as well for the rest.
  const viewAllRoles = () => {
    db.query(`SELECT * FROM role`, (err, result) => {
      if (err) throw err;
      console.log("View All Roles");
    //   console.log(result.fields[0].name);
      result.fields.forEach((role) => console.log(role.name));
    });
  };

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  employee_tracker();
});
