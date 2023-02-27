--Example Employees-- 

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Abel', 'Washington', 1, 3), ('Otis', 'Rodriguez', 2, 1), ('Tiffany', 'Dew', 3, null), ('Alvin', 'Turner', 4, 3), ('Mal', 'Lampkin', 5, null), ('Christina', 'Chan', 6, null), ('Joshua', 'Wilson', 7, 6), ('Evelyn', 'Paranti', 3, 2);

--Example Employee roles
INSERT INTO employee_Role(title, salary, department_id)
VALUES ('Sales lead', 100000, 1), ('Sales person', 80000, 1), ('Lead engineer', 150000, 2), ('Software engineer', 120000, 2), ('Accountant', 125000, 3), ('Legal team lead', 250000, 4), ('Lawyer', 190000, 4);

--example employee departments
INSERT INTO employee_Dept(dept_name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');

--view all table--

SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, employee_dept.dept_name, employee_role.salary, CONCAT(manager.first_name,'', manager.last_name) AS manager
FROM employee 
LEFT JOIN employee manager ON manager.id = employee.manager_id
INNER JOIN employee_Role ON employee.role_id = employee_Role.id
INNER JOIN employee_Dept ON employee_Dept.id = employee_Role.department_id;

SELECT dept_name FROM employee_Dept;

SELECT title FROM employee_Role
