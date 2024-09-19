# Employee Management System

This project is a backend system for managing employee data, user registration, login with JWT authentication, and employee CRUD operations (Create, Read, Update, Delete). It is built using Node.js, Express.js, MongoDB, and JWT for authentication.

## Features

- **User Registration & Login**: 
  - Users can register and log in to the system.
  - Passwords are hashed using `bcrypt`.
  - Login sessions are managed using JWT tokens.
  
- **Employee Management**: 
  - Add new employees with a unique employee number.
  - Edit existing employee details.
  - Delete employees, with automatic renumbering of the employee list.
  - View all employees.
  
- **Authentication Middleware**: 
  - JWT-based authentication is used to secure employee-related endpoints.
  - Each request is validated using a token stored in cookies.

## Components

### 1. **User Registration & Login**

#### **Register Route**: 
`POST /api/user/register`
- Accepts: `name`, `email`, `password`
- Creates a new user with hashed password and stores in MongoDB.

#### **Login Route**: 
`POST /api/user/login`
- Accepts: `email`, `password`
- Verifies the user's credentials and returns a JWT token if successful.

### 2. **Employee Management**

#### **Add Employee**: 
`POST /api/employee/addEmployee`
- Accepts: `name`, `email`, `mobile`, `designation`, `gender`, `course`
- Adds a new employee to the database, assigning an automatic employee number.

#### **Get All Employees**: 
`GET /api/employee/getAllEmployees`
- Fetches a list of all employees from the database.

#### **Edit Employee**: 
`PUT /api/employee/editEmployee/:id`
- Accepts: `name`, `email`, `mobile`, `designation`, `gender`, `course`
- Updates an existing employee’s information by ID.

#### **Delete Employee**: 
`DELETE /api/employee/deleteEmployee/:id`
- Deletes an employee by ID.
- Automatically reorders the employee numbers after deletion.

### 3. **Authentication Middleware**

#### **Token Verification**:
`auth.verifyToken`
- This middleware ensures the request is authenticated by checking the JWT token in the cookies.
- If the token is valid, it allows access to the protected routes like adding, editing, or deleting employees.


## License

This project is licensed under the MIT License.