const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "test",
        password: "test",
        database: "employee_db"
    },
    console.log("Connected to the employee_db database.")
);

const cmdPrompt = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "cmd",
                message: "What would you like to do?",
                choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
            }
        ])
        .then((answers) => {
            if (answers.cmd == "View All Employees") {
                viewAllEmployees();
            }
            else if (answers.cmd == "View All Roles") {
                viewAllRoles();
            }
            else if (answers.cmd == "View All Departments") {
                viewAllDepartments();
            }
            else if (answers.cmd == "Add Employee") {
                addEmployee();
            }
            else if (answers.cmd == "Add Role") {
                addRole();
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

const viewAllRoles = () => {
    const sql = `
        SELECT roles.id, roles.title, departments.name AS department_name, roles.salary
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id
    `;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

const viewAllDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(rows);
    });
}

const addEmployee = () => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        const sql = `SELECT * FROM employees`
        db.query(sql, (err, manager_rows) => {
            if (err) {
                console.log(err);
                return;
            }
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "What is the employee's first name?"
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "What is the employee's last name?"
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What is the employee's role?",
                        choices: rows.map((role) => {
                            return {
                                name: role.title,
                                value: role.id
                            }
                        })
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: [{ name: "None", value: null }, ...manager_rows.map((manager) => {
                            return {
                                name: manager.first_name + " " + manager.last_name,
                                value: manager.id
                            }
                        })]
                    },
                ])
                .then((answers) => {
                    const sql = `
                        INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role}, ${answers.manager})
                    `;
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log("Added " + answers.first_name + " " + answers.last_name + " to the database");
                    });
                });
        })

    });
}

const addRole = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        inquirer.prompt([
            {
                type: "input",
                name: "role",
                message: "What is the name of the role?"
            },
            {
                type: "number",
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "department",
                message: "What department does the role belong to?",
                choices: rows.map((department) => {
                    return {
                        name: department.name,
                        value: department.id
                    }
                })
            }
        ])
        .then((answers) => {
            const sql = `
            INSERT INTO roles (title, salary, department_id)
            VALUES (${answers.role}, ${answers.salary}, ${answers.department})
            `;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Added " + answers.role + " to the database");
            });
        });
    });
}

cmdPrompt();