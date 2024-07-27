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
          "Delete A Department",
          "Delete A Role",
          "Delete An Employee",
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
        case "Delete A Department":
          deleteDepartment();
          break;
        case "Delete A Role":
          deleteRole();
          break;
        case "Delete An Employee":
          deleteEmployee();
          break;
        case "Log Out":
          db.end();
          break;
      }
    });
};

// View All Departments
const viewAllDepartments = () => {
  db.query(`SELECT id, name FROM department`, (err, result) => {
    if (err) throw err;
    console.log("Viewing All Departments:");
    console.table(result.rows);
    employee_tracker();
  });
};

// View All Roles
const viewAllRoles = () => {
  db.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`, (err, result) => {
    if (err) throw err;
    console.log("Viewing All Roles:");
    console.table(result.rows);
    employee_tracker();
  });
};

// View All Employees
const viewAllEmployees = () => {
  db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, result) => {
    if (err) throw err;
    console.log("Viewing All Employees:");
    console.table(result.rows);
    employee_tracker();
  });
};

// Add a Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then((answer) => {
      db.query(`INSERT INTO department (name) VALUES ($1)`, [answer.name], (err, result) => {
        if (err) throw err;
        console.log("Department added!");
        employee_tracker();
      });
    });
};

// Add a Role
const addRole = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    const departments = result.rows.map(({ id, name }) => ({ name, value: id }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for the role:",
        },
        {
          type: "list",
          name: "department_id",
          message: "Select the department for the role:",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [answer.title, answer.salary, answer.department_id], (err, result) => {
          if (err) throw err;
          console.log("Role added!");
          employee_tracker();
        });
      });
  });
};

// Add an Employee
const addEmployee = () => {
  db.query(`SELECT * FROM role`, (err, result) => {
    if (err) throw err;
    const roles = result.rows.map(({ id, title }) => ({ name: title, value: id }));
    db.query(`SELECT * FROM employee`, (err, result) => {
      if (err) throw err;
      const managers = result.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
      managers.push({ name: "None", value: null });
      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "Enter the first name of the employee:",
          },
          {
            type: "input",
            name: "last_name",
            message: "Enter the last name of the employee:",
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the role for the employee:",
            choices: roles,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Select the manager for the employee:",
            choices: managers,
          },
        ])
        .then((answer) => {
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, result) => {
            if (err) throw err;
            console.log("Employee added!");
            employee_tracker();
          });
        });
    });
  });
};

// Update an Employee Role
const updateEmployeeRole = () => {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    const employees = result.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    db.query(`SELECT * FROM role`, (err, result) => {
      if (err) throw err;
      const roles = result.rows.map(({ id, title }) => ({ name: title, value: id }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee_id",
            message: "Select the employee to update:",
            choices: employees,
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the new role for the employee:",
            choices: roles,
          },
        ])
        .then((answer) => {
          db.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, [answer.role_id, answer.employee_id], (err, result) => {
            if (err) throw err;
            console.log("Employee role updated!");
            employee_tracker();
          });
        });
    });
  });
};

// Delete a Department
const deleteDepartment = () => {
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    const departments = result.rows.map(({ id, name }) => ({ name, value: id }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "department_id",
          message: "Select the department to delete:",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query(`DELETE FROM department WHERE id = $1`, [answer.department_id], (err, result) => {
          if (err) throw err;
          console.log("Department deleted!");
          employee_tracker();
        });
      });
  });
};

// Delete a Role
const deleteRole = () => {
  db.query(`SELECT * FROM role`, (err, result) => {
    if (err) throw err;
    const roles = result.rows.map(({ id, title }) => ({ name: title, value: id }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "role_id",
          message: "Select the role to delete:",
          choices: roles,
        },
      ])
      .then((answer) => {
        db.query(`DELETE FROM role WHERE id = $1`, [answer.role_id], (err, result) => {
          if (err) throw err;
          console.log("Role deleted!");
          employee_tracker();
        });
      });
  });
};

// Delete an Employee
const deleteEmployee = () => {
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    const employees = result.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee_id",
          message: "Select the employee to delete:",
          choices: employees,
        },
      ])
      .then((answer) => {
        db.query(`DELETE FROM employee WHERE id = $1`, [answer.employee_id], (err, result) => {
          if (err) throw err;
          console.log("Employee deleted!");
          employee_tracker();
        });
      });
  });
};


// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  employee_tracker();
});
