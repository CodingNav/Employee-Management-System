const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'test',
        password: 'test',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database.')
);

const cmdPrompt = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'cmd',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
    ])
    .then((answers) => {
        if (answers.cmd == 'View All Employees') {
            viewAllEmployees();
        }
    });
}

const viewAllEmployees = () => {
    const sql = `
                SELECT employees.id, employees.first_name, employees.last_name, departments.name AS department_name, roles.salary, CONCAT(managers.first_name," ", managers.last_name) AS manager
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees AS managers
                ON employees.manager_id = managers.id;
    
                `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

cmdPrompt();