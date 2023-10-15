const mysql = require('mysql2');
const inquirer = require('inquirer');
const connection = require('./config/connection');


const employeeModel = require('./models/employee');
const roleModel = require('./models/role');
const departmentModel = require('./models/department');




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
        console.table(results);  
        startPrompt();  
    });
}

//------------------------ View all roles ------------------------
function viewAllRoles() {
    roleModel.getAll((err, results) => {
        if (err) throw err;
        console.table(results);  
        startPrompt();  
    });
}

//------------------------View all departments ------------------------
function viewAllDepartments() {
    departmentModel.getAll((err, results) => {
        if (err) throw err;
        console.table(results);  
        startPrompt();  
    });
}

//------------------------ Add employee ------------------------
function addEmployee() {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'First name of the employee:',
        },
    ]).then(answers => {
        employeeModel.add(answers, (err, results) => {
            if (err) throw err;
            console.log('Employee added!');
            startPrompt();
        });
    });
}

startPrompt(); 