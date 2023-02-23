// install packages 
const inquirer = require('inquirer')
const fs = require('fs')
const mysql = require('mysql2');
require('console.table')

let employeesArray = [];
let positionArray = [];

//connect to sql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'password',
    database: 'employeeTracker_db'
});

//First Question for user
const mainmenu = () => {
    inquirer.prompt ([
        {
            type: 'list', 
            name: 'employeeChoice', 
            message: "What would you like to do?", 
            choices: ['View all Employees', 
                        'View Departments',
                        'View Roles',
                        'Add Employee',
                        'Add Roles', 
                        'Update Employee Role',
                        'Exit'
                    ]

        }
    ]).then ((answer) => {
        switch(answer.employeeChoice){
            case 'View all Employees':
                viewallEmployees();
            break;

            case 'View Roles':
                viewRoles();
                break;
            
            case 'View Departments':
                viewDepartments();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Add Roles':
                addRoles();
                break;

            case 'Update Employee Role':
                updateEmployeeRole();
                break;
        }
    });
};

//view employees function

const viewallEmployees = () =>{
    const query = `SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, employee_dept.dept_name, employee_role.salary, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    INNER JOIN employee_Role ON employee.role_id = employee_role.id
    INNER JOIN employee_Dept ON employee_Dept.id = employee_Role.department_id;`
    connection.query(query, (err, res) => {
        if (err) throw err
        console.log("view all employees")
        console.table(res)
        employeeUpdate()
    })
};

//Function to view roles
const viewRoles = () => {
    rolesArray = []
    const query = `SELECT title FROM employee_Role`
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach(({title}) => {
            rolesArray.push(title);
        console.log('Viewing Roles')
        console.table(res)
        console.log(rolesArray)
        employeeUpdate()
        })
    })
};


//Function to view all departments
const viewDepartments = () => {
    const query = `SELECT dept_name FROM employee_Dept`
    connection.query(query, (err, res) => {
        if (err) throw err
        console.log('Currently viewing Departments')
        console.table(res)
        employeeUpdate()
    })
};

//function to add employees
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employees first name?',
            name: 'firstName'
        },
        {
            type: 'input', 
            message: 'What is the employees Last name?',
            name: 'lastName'
        },
        {
            type: 'input', 
            message: 'What is the employee manager id?',
            name: 'managersId'
        },
        {
            type: 'input',
            message: 'What is the employees role id?',
            name: 'roleId'
        }
    ]).then((answers) => {
        connection.query(`INSERT INTO employee SET ?`, 
        {
            first_name: answers.firstName,
            last_name: answers.lastName, 
            manager_id: answers.managersId,
            role_id:answers.roleId
        })
    })
};

//function to find new department