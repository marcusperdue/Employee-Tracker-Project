const mysql = require('mysql2');
const inquirer = require('inquirer');
const connection = require('./config/connection');
const departmentModel = require('./models/department');

const employeeModel = require('./models/employee');
const roleModel = require('./models/role');


const cfonts = require('cfonts');
const Table = require('cli-table3');

//------------------------ Starting prompts ------------------------
function displayCustomTitle() {
    const text = 'Employee Manager';
    const fontOptions = { font: 'block', align: 'center', 
    colors: ['cyan'], background: 'transparent', letterSpacing: 1, 
    lineHeight: 1, space: true };
    console.log(cfonts.render(text, fontOptions).string);
  }
  
  module.exports = displayCustomTitle;
  displayCustomTitle();
//------------------------ Starting prompts ------------------------
function startPrompt() {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View all roles',
          'View all departments',
          'Add an employee',
          'Add a role',
          'Add a department',
          'Update employee role',
          'Update employee manager',
          'Delete an employee',
          'Exit'
        ]
      })
      .then(answer => {
        switch (answer.action) {
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'View all roles':
            viewAllRoles();
            break;
          case 'View all departments':
            viewAllDepartments();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Update employee role':
            updateEmployeeRole();
            break;
        case 'Update employee manager': // New case for updating manager
            updateEmployeeManagerPrompt();
            break;
          case 'Exit':
            connection.end();
            break;
          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
            case 'Delete a department': // New case for deleting department
            deleteDepartmentPrompt();
            break;
        case 'Delete a role':       // New case for deleting role
            deleteRolePrompt();
            break;
        case 'Delete an employee':  // New case for deleting employee
            deleteEmployeePrompt();
            break;
        case 'Exit':
            connection.end();
            break;
          
        }
      });
}

//------------------------ View all employees ------------------------
function viewAllEmployees() {
    employeeModel.getAll((err, results) => {
        if (err) throw err;

        const table = new Table({
            head: ['Employee ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager Name'],
            colWidths: [15, 15, 15, 19, 15, 15, 18],
            style: { compact: true }
        });


        results.forEach((employee) => {
            table.push([
                employee.employee_id,
                employee.first_name,
                employee.last_name,
                employee.title,
                employee.department,
                employee.salary,
                employee.manager_name
            ]);
        });

        console.log(table.toString());

        startPrompt();
    });
}


//------------------------ View all roles ------------------------
function viewAllRoles() {
    roleModel.getAll((err, results) => {
        if (err) throw err;

        const table = new Table({
            head: ['Role ID', 'Title', 'Salary', 'Department ID', 'Department Name'],
            colWidths: [15, 30, 15, 15, 30],
            style: { compact: true }
        });

        results.forEach((role) => {
            table.push([
                role.roleId,
                role.title,
                role.salary,
                role.departmentId,
                role.departmentName
            ]);
        });

        console.log(table.toString());

        startPrompt();
    });
}


//------------------------View all departments ------------------------

function viewAllDepartments() {
    departmentModel.getAll((err, results) => {
        if (err) throw err;

        const table = new Table({
            head: ['Department ID', 'Name'],
            colWidths: [15, 30],
            style: { compact: true }
        });

        results.forEach((department) => {
            table.push([
                department.id,
                department.name
            ]);
        });

        console.log(table.toString());


        startPrompt();
    });
}

//------------------------ Add a role ------------------------
 
function addRole() {
    departmentModel.getAll((err, departments) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Title of the role:',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Salary for the role:',
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for this role:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                })),
            },
        ]).then(answers => {
            roleModel.add(answers, (err, results) => {
                if (err) throw err;
                console.log('Role added!');
                startPrompt();
            });
        });
    });
}

 

//------------------------ Add a department ------------------------
function addDepartment() {
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'Name of the department:',
        },
      ])
      .then((answers) => {
        
        departmentModel.add(answers, (err, results) => {
          if (err) throw err;
          console.log('Department added!');
          startPrompt();  
        });
      });
  }

//------------------------ Add employee ------------------------
 
function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.first_name, answer.last_name];

      
        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.promise().query(roleSql)
        .then(([rows, fields]) => {
            const roles = rows.map(({ id, title }) => ({ name: title, value: id }));

            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's role?",
                    choices: roles
                }
            ]);
        })
        .then(roleChoice => {
            const role_id = roleChoice.role_id;
            params.push(role_id);

             
            const managerSql = `SELECT id, first_name, last_name FROM employee`;

            return connection.promise().query(managerSql);
        })
        .then(([rows, fields]) => {
            const managers = rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Who is the employee's manager?",
                    choices: managers
                }
            ]);
        })
        .then(managerChoice => {
            const manager_id = managerChoice.manager_id;
            params.push(manager_id);

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;

            return connection.promise().query(sql, params);
        })
        .then(() => {
            console.log("Employee has been added!");
            viewAllEmployees();  
        })
        .catch(err => {
            console.error(err);
        });
    });
}




//------------------------ Update employee ------------------------

function getEmployees(callback) {
    const sql = 'SELECT id, first_name, last_name FROM employee';
    connection.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}
function getRoles(callback) {
    const sql = 'SELECT id, title FROM role';
    connection.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

//------------------------ Update employee role ------------------------
function updateEmployee(data, callback) {
    const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const values = [data.role_id, data.employee_id];

    connection.query(sql, values, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}
function updateEmployeeRole() {
   
    getEmployees((err, employees) => {
        if (err) throw err;

       
        getRoles((err, roles) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Which employee would you like to update? (or select "Exit" to return to the main menu)',
                    choices: [...employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    })), 'Exit'],
                },
            ]).then(employeeAnswer => {
                if (employeeAnswer.employee_id === 'Exit') {
                    startPrompt();
                } else {
                    inquirer.prompt([
                        {
                            name: 'role_id',
                            type: 'list',
                            message: 'What is the new role for this employee?',
                            choices: roles.map(role => ({
                                name: role.title,
                                value: role.id
                            })),
                        }
                    ]).then(roleAnswer => {
                        const updateData = {
                            employee_id: employeeAnswer.employee_id,
                            role_id: roleAnswer.role_id
                        };

                       
                        updateEmployee(updateData, (err, results) => {
                            if (err) throw err;
                            console.log('Employee role updated!');
                            startPrompt();
                        });
                    });
                }
            });
        });
    });
}

//------------------------ Update employee manager------------------------
function updateEmployeeManager(data, callback) {
    const sql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
    const values = [data.manager_id, data.employee_id];

    connection.query(sql, values, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function updateEmployeeManagerPrompt() {
    getEmployees((err, employees) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Which employee would you like to update their manager? (or select "Exit" to return to the main menu)',
                choices: [...employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                })), 'Exit'],
            },
        ]).then(employeeAnswer => {
            if (employeeAnswer.employee_id === 'Exit') {
                startPrompt();
            } else {
                inquirer.prompt([
                    {
                        name: 'manager_id',
                        type: 'list',
                        message: 'Select the new manager for this employee:',
                        choices: employees.map(employee => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        })),
                    }
                ]).then(managerAnswer => {
                    const updateData = {
                        employee_id: employeeAnswer.employee_id,
                        manager_id: managerAnswer.manager_id
                    };

                    updateEmployeeManager(updateData, (err, results) => {
                        if (err) throw err;
                        console.log('Employee manager updated!');
                        startPrompt();
                    });
                });
            }
        });
    });
}

function deleteDepartment(id, callback) {
    const sql = 'DELETE FROM department WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function deleteRole(id, callback) {
    const sql = 'DELETE FROM role WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function deleteEmployee(id, callback) {
    const sql = 'DELETE FROM employee WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}
function deleteDepartmentPrompt() {
    departmentModel.getAll((err, departments) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department to delete:',
                choices: departments.map(department => ({
                    name: department.name,
                    value: department.id
                })),
            },
        ]).then(answer => {
            deleteDepartment(answer.department_id, (err, results) => {
                if (err) throw err;
                console.log('Department deleted!');
                startPrompt();
            });
        });
    });
}
function deleteRolePrompt() {
    roleModel.getAll((err, roles) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role to delete:',
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                })),
            },
        ]).then(answer => {
            deleteRole(answer.role_id, (err, results) => {
                if (err) throw err;
                console.log('Role deleted!');
                startPrompt();
            });
        });
    });
}

function deleteEmployeePrompt() {
    getEmployees((err, employees) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to delete:',
                choices: employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                })),
            },
        ]).then(answer => {
            deleteEmployee(answer.employee_id, (err, results) => {
                if (err) throw err;
                console.log('Employee deleted!');
                startPrompt();
            });
        });
    });
}

startPrompt(); 