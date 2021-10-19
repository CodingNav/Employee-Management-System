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
    const sql = `SELECT * FROM employees`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}