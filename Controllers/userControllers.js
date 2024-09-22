import User from "../Schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Employee from "../Schema/employeeSchema.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Multer storage and file filter setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (mimetype && extname) cb(null, true);
    else cb(new Error('Only .jpg and .png files are allowed!'));
};

// Export multer upload
export const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter
});

// User controller logic
const userController = {
    register: async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

        const hashedPassword = bcrypt.hashSync(password, 12);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
        });

        res.status(200).json({ message: "User logged in successfully", token, user });
    },

    forgotPassword: async (req, res) => {
        const { email, password, confirmpassword } = req.body;

        if (!email || !password || !confirmpassword) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
        if (password !== confirmpassword) return res.status(400).json({ message: "Passwords do not match" });

        const hashedPassword = bcrypt.hashSync(password, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    },

    getAllEmployees: async (req, res) => {
        try {
            const employees = await Employee.find({ userid: req.user.id });
            res.status(200).json({ employees });
        } catch (error) {
            res.status(500).json({ message: "Error fetching employees", error });
        }
    },

    addEmployee: async (req, res) => {
        const { name, email, mobile, designation, gender, course, date } = req.body;

        const newEmployee = new Employee({
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            date,
            image: req.file?.path || '',
            userid: req.user.id
        });

        await newEmployee.save();
        res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
    },

    deleteEmployee: async (req, res) => {
        try {
            const employee = await Employee.findByIdAndDelete(req.params.id);
            if (!employee) return res.status(404).json({ message: "Employee not found" });

            res.status(200).json({ message: "Employee deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting employee", error });
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ message: "Employee not found" });

            Object.assign(employee, req.body, { image: req.file?.path || employee.image });
            await employee.save();

            res.status(200).json({ message: "Employee updated successfully", employee });
        } catch (error) {
            res.status(500).json({ message: "Error updating employee", error });
        }
    }
};

export default userController;
