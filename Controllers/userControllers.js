

import User from "../Schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Employee from "../Schema/employeeSchema.js";

dotenv.config();

const userController = {

    register: async (req, res) => { 
        try {
            //getting details from users
            const { name, email, password } = req.body;

            //to ensure that all fields are filled
            if (!name || !email || !password) { 
                return res.status(400).json({ message: "All fields are required" });
            }

            //check the user already exixts
            const user = await User.findOne({ email });
            if (user) { 
                return res.status(400).json({ message: "User already exists" });
            }

            //Password checking
            if (password.length < 6) { 
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }

            //hashing the password
            const hashedPassword = await bcrypt.hashSync(password, 12);

            //creating a new user
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });
            

            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            // Get email and password from request body
            const { email, password } = req.body;

            // Check if both fields are provided
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check if the password length is valid
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters" });
            }

            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User does not exist, kindly register and login" });
            }

            // Check if the password matches
            const isMatch = await bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // If the password is correct, generate a JWT token
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
            }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Set a cookie with the token
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 1 day
            });

            // Send success response with token
            res.status(200).json({ message: "User logged in successfully", token });

        } catch (error) {
            // Catch any errors and respond with 500
            res.status(500).json({ message: "Error occurred during login", error: error.message });
        }
    },

    addEmployee: async (req, res) => {
        try {
            const { name, email, mobile, designation, gender, course } = req.body;

            // Validate input fields
            if (!name || !email || !mobile || !designation || !gender || !course) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(emailRegex)) {
                return res.status(400).json({ message: "Invalid email" });
            }

            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({ message: "Invalid mobile number" });
            }

            // Count current employees to assign a new number
            const employeeCount = await Employee.countDocuments();

            // Create a new employee with the employee number
            const newEmployee = await Employee.create({
                no: employeeCount + 1, // Assign the new employee number
                name,
                email,
                mobile,
                designation,
                gender,
                course
            });

            // Respond with success
            res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
        } catch (error) {
            console.error("Error creating employee:", error.message);
            res.status(500).json({ message: "Error occurred in adding employee", error: error.message });
        }
    },



    getAllEmployees: async (req, res) => {
        try {
            // Retrieve all employees from the database
            const employees = await Employee.find();

            // Respond with the list of employees
            res.status(200).json({ message: "Employees retrieved successfully", employees });
        } catch (error) {
            // Handle errors
            res.status(500).json({ message: "Error occurred while retrieving employees", error: error.message });
        }
    },


    updateEmployee: async (req, res) => {
        try {
            const { id } = req.params; // Get employee ID from URL params
            const { name, email, mobile, designation, gender, course } = req.body;

            // Ensure all fields are filled (optional)
            if (!name && !email && !mobile && !designation && !gender && !course) {
                return res.status(400).json({ message: "At least one field is required for update" });
            }

            // Find the employee by ID and update
            const updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                { name, email, mobile, designation, gender, course },
                { new: true, runValidators: true } // new: true returns the updated document
            );

            if (!updatedEmployee) {
                return res.status(404).json({ message: "Employee not found" });
            }

            res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
        } catch (error) {
            res.status(500).json({ message: "Error occurred in updating employee", error: error.message });
        }
    },

    deleteEmployee: async (req, res)=>{
        try {
            const { id } = req.params;
            const deletedEmployee = await Employee.findByIdAndDelete(id);

            if (!deletedEmployee) {
                return res.status(404).json({ message: "Employee not found" });
            }
            // Renumber remaining employees
            const employees = await Employee.find().sort({ no: 1 }); // Sort employees by their current number
            for (let i = 0; i < employees.length; i++) {
                employees[i].no = i + 1; // Set new number
                await employees[i].save(); // Save updated employee
            }

            res.status(200).json({ message: "Employee deleted successfully", employee: deletedEmployee });
        } catch (error) {
            res.status(500).json({message:"error occurs in delete employee",error:error.message})
        }
    }




}


export default userController