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
            choices: ['Department1', 'Department2'] 
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
    inquirer.prompt([
        {
            name: 'department_name',
            type: 'input',
            message: 'Name of the department:',
        }
    ]).then(answers => {
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

//------------------------ Update employee ------------------------
function updateEmployeeRole() {
    inquirer.prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: [],  
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'What is the new role for this employee?',
            choices: []  
        }
    ]).then(answers => {
        employeeModel.updateRole(answers, (err, results) => {
            if (err) throw err;
            console.log('Employee role updated!');
            startPrompt();
        });
    });
}
 

startPrompt(); 