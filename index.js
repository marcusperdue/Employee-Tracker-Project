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
          case 'Exit':
            connection.end();
            break;
          default:
            console.log(`Invalid action: ${answer.action}`);
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
            colWidths: [15, 15, 15, 15, 15, 15, 18],
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

        // Create a table
        const table = new Table({
            head: ['Department ID', 'Name'],
            colWidths: [15, 30],
            style: { compact: true }
        });

        // Populate the table with data
        results.forEach((department) => {
            table.push([
                department.id,
                department.name
            ]);
        });

        // Display the table
        console.log(table.toString());

        // After displaying the data, go back to the main prompt
        startPrompt();
    });
}

//------------------------ Add a role ------------------------
function addRole() {
    inquirer.prompt([
        {
            name: 'role_name',
            type: 'input',
            message: 'Name of the role:',
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Salary for the role:',
        },
        {
            name: 'department',
            type: 'list',   
            message: 'Which department does this role belong to?',
            choices: departments.map(department => department.name),
        }
    ]).then(answers => {
        roleModel.add(answers, (err, results) => {
            if (err) throw err;
            console.log('Role added!');
            startPrompt();
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
    employeeModel.getAll((err, employees) => {
        if (err) throw err;

        roleModel.getAll((err, roles) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'First name of the employee:',
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Last name of the employee:',
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the role for this employee:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    })),
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the manager for this employee (if applicable):',
                    choices: employees.map(employee => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    })),
                },
            ]).then(answers => {
                employeeModel.add(answers, (err, results) => {
                    if (err) throw err;
                    console.log('Employee added!');
                    startPrompt();
                });
            });
        });
    });
}



//------------------------ Update employee ------------------------

function updateEmployeeRole() {
    employeeModel.getAll((err, employees) => {
        if (err) throw err;

        roleModel.getAll((err, roles) => {
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
            ]).then(answers => {
                if (answers.employee_id === 'Exit') {
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
                            employee_id: answers.employee_id,
                            role_id: roleAnswer.role_id
                        };
                        employeeModel.updateRole(updateData, (err, results) => {
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

 

startPrompt(); 