// Variable Definitions & Dependencies
const inquirer = require('inquirer');
const db = require('./db/connection');

// Starting server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    employee_tracker();
});

// Main function for employee tracker
var employee_tracker = function () {
    inquirer.prompt([{

        // Command Line Start
        type: 'list',
        name: 'prompt',
        message: 'What would you like to do?',
        choices: ['View All Department', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Log Out']
    }]).then((answers) => {

        // View options
        if (answers.prompt === 'View All Department') {

            // View All Departments
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Departments: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Roles') {

            // View All Roles
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Roles: ");
                console.table(result);
                employee_tracker();
            });
        } else if (answers.prompt === 'View All Employees') {

            // View All Employees
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log("Viewing All Employees: ");
                console.table(result);
                employee_tracker();
            });
        } 
        
        // Adding user data from prompts
        else if (answers.prompt === 'Add A Department') {

            // Adding A Department
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please Add A Department!');
                        return false;
                    }
                    // inserting data into the db
                }
            }]).then((answers) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.department} to the database.`)
                    employee_tracker();
                });
            })
        } else if (answers.prompt === 'Add A Role') {
            // Add A Role with prompt to role name
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?',
                        validate: roleInput => {
                            if (roleInput) {
                                return true;
                            } else {
                                console.log('Please enter a role name!');
                                return false;
                            }
                        }
                    },
                    // Prompt for role salary
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?',
                        validate: salaryInput => {
                            if (salaryInput) {
                                return true;
                            } else {
                                console.log('Please enter a salary!');
                                return false;
                            }
                        }
                    },
                    // Prompt for department
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            // Generate choices based on available departments
                            let departmentChoices = result.map(department => department.name);
                            return departmentChoices;
                        }
                    }
                ]).then((answers) => {
                    // inserting data to the db
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, answers.department], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.role} to the database.`)
                        employee_tracker();
                    });
                });
            });
        } else if (answers.prompt === 'Add An Employee') {
            // Add An Employee
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    // Prompt for employee's first name
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employee\'s first name?',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please enter a first name!');
                                return false;
                            }
                        }
                    },
                    // Prompt for employee's last name
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employee\'s last name?',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please enter a last name!');
                                return false;
                            }
                        }
                    },
                    // Prompt for employee's role
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s role?',
                        choices: () => {
                            // Generate choices based on available roles
                            let roleChoices = result.map(role => role.title);
                            return roleChoices;
                        }
                    },
                    // Prompt for employee's manager
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employee\'s manager? (Enter manager ID)'
                    }
                ]).then((answers) => {
                    // Process the answers and insert the employee into the database
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
                        employee_tracker();
                    });
                });
            });
        } 
        else if (answers.prompt === 'Update An Employee Role') {
            // Update An Employee Role
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;

                inquirer.prompt([
                    // Prompt for employee to update
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee\'s role do you want to update?',
                        choices: () => {
                            // Generate choices based on available employees
                            let employeeChoices = result.map(employee => `${employee.first_name} ${employee.last_name}`);
                            return employeeChoices;
                        }
                    },
                    // Prompt for new role
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            // Generate choices based on available roles
                            let roleChoices = result.map(role => role.title);
                            return roleChoices;
                        }
                    }
                ]).then((answers) => {
                    db.query(`UPDATE employee SET role = ? WHERE name = ?`, [answers.role, answers.employee], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${answers.employee}'s role to ${answers.role}.`)
                        employee_tracker();
                    });
                });
            });
        }
    });
};