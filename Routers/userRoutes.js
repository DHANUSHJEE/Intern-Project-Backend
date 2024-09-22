import express from "express";
import userController from "../Controllers/userControllers.js";
import verifyToken from "../Auth/auth.js";
import { upload } from '../Controllers/userControllers.js';

const router = express.Router();

// Register
router.post("/signup", userController.register);

// Login
router.post("/login", userController.login);

// Forgot password
router.post("/forgotpassword", userController.forgotPassword);

// Get all employees (protected)
router.get('/getAllEmployees', verifyToken, userController.getAllEmployees);

// Add a new employee (protected, with image upload)
router.post('/addEmployee', verifyToken, upload.single('image'), userController.addEmployee);

// Delete employee (protected)
router.delete('/deleteEmployee/:id', verifyToken, userController.deleteEmployee);

// Update employee (protected, with image upload)
router.put('/updateEmployee/:id', verifyToken, upload.single('image'), userController.updateEmployee);

export default router;
