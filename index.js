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
    result.rows.forEach((department) => console.log(department.name));
    employee_tracker();
  });
}; 

//   view all roles
  const viewAllRoles = () => {
    db.query(`SELECT * FROM role`, (err, result) => {
      if (err) throw err;
      console.log("View All Roles");
    //   console.log(result.fields[0].name);
      result.fields.forEach((role) => console.log(role.name));
    });
  };

  // view all employees
  const viewAllEmployees = () => {
    db.query(`SELECT name FROM employees`, (err, result) => {
      if (err) throw err;
      console.log("Viewing employee");
      result.rows.forEach((employee)=> console.log(employee.name))
    });
  };

  // just for reference
  // case "Add A Department":
  //   addDepartment();
  //   break;
  // case "Add A Role":
  //   addRole();
  //   break;
  // case "Add An Employee":
  //   addEmployee();
  //   break;
  // case "Update An Employee Role":
  //   updateEmployeeRole();
  //   break;
  // case "Log Out":
  //   db.end();
  //   break;
          // "Add A Department",
          // "Add A Role",
          // "Add An Employee",
          // "Update An Employee Role",
          // "Log Out",



  const addDepartment = () => {
    inquirer
    .prompt ([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ]).then(answer => {
      db.query(`INSERT INTO department (name) VALUES ()`, [answer.name], (err,result) => {
        if (err) throw err;
        console.log("Department added!");
        employee_tracker();
      });
    });
  };


  // //  .then((answers) => {
  //   switch (answers.choice) {
  //     case "View All Departments":

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  employee_tracker();
});
