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
    inquirer.prompt([
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
    ]).then((answer) => {
        switch (answer.employeeChoice) {
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

const viewallEmployees = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, employee_dept.dept_name, employee_role.salary, CONCAT(manager.first_name, manager.last_name) AS manager FROM employee
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    INNER JOIN employee_Role ON employee.role_id = employee_role.id
    INNER JOIN employee_Dept ON employee_Dept.id = employee_Role.department_id;`
    connection.query(query, (err, res) => {
        if (err) throw err
        console.log("Viewing all employees")
        console.table(res)
        mainmenu()
    })
};

//Function to view roles
const viewRoles = () => {
    positionArray = []
    const query = `SELECT title FROM employee_Role`
    connection.query(query, (err, res) => {
        if (err) throw err;
        res.forEach(({ title }) => {
            positionArray.push(title);
            console.log('Viewing Roles')
            console.table(res)
            console.log(positionArray)
            mainmenu()
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
        mainmenu()
    })
};

//function to add employees
const addEmployee = () => {
    inquirer.prompt([
        {

            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?'
            
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees Last name?'
            
        },
        {
            type: 'input',
            name: 'managersId',
            message: 'What is the employee manager id?'
           
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'What is the employees role id?'
          
        }
    ]).then((answers) => {
        connection.query(`INSERT INTO employee SET ?`,
        //renaming the inquirer table names to names I will be using in seedsql
            {
                first_name: answers.firstName,
                last_name: answers.lastName,
                manager_id: answers.managersId,
                role_id: answers.roleId
            },
            (err) => {
                if (err) throw err;
                console.log('Employee Added')
                console.table(answers)
                //will always return back to the main menu
                mainmenu()
            })
    })
};

// add roles function
const addRoles = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What role would you like to add?',
            name: 'newRole'
        },
        {
            type: 'input',
            message: 'What is the salary for this role?',
            name: 'salary'
        }
    ]).then((answers) => {
        connection.query(`INSERT INTO employee_Role SET ?`,
            {
                title: answers.newRole,
                salary: answers.salary
            },
            (err) => {
                if (err) throw err;
                console.log('New Role Added')
                console.table(answers)
                mainmenu()
            })
    })
}
//function to find new department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            name: 'newDept'
        }
    ]).then((answers) => {
        connection.query(`INSERT INTO employee_Dept SET ?`,
            {
                dept_name: answers.newDept
            },
            (err) => {
                if (err) throw err;
                console.log('Added new Department')
                console.table(answers)
                mainmenu()
            })
    })
};


// push information into an array
employeesArray = [];
const query = 'SELECT first_name FROM employee';
connection.query(query, (err, res) => {
    if (err) throw err;
    res.forEach(({ first_name }) => {
        employeesArray.push(first_name);
    });
});
positionArray = []
const query2 = `SELECT title FROM employee_Role`
connection.query(query2, (err, res) => {
    if (err) throw err;
    res.forEach(({ title }) => {
        positionArray.push(title);
    });
});
// function to update employee role 
const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: employeesArray,
            name: 'roleUpdate'
        },
        {
            type: 'list',
            message: 'Enter the new role',
            choices: positionArray,
            name: 'newRole'
        }
    ]).then((answers) => {
        connection.query(`UPDATE employee_Role SET title = ? WHERE first_name = ?`,
            {
                title: answers.newRole,
                first_name: answers.roleUpdate
            },
            (err) => {
                if (err) throw err;
                console.log('Employee role updated')
                console.table(answers)
                mainmenu()
            })


    })
}
mainmenu()