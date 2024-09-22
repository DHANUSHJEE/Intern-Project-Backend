import express from "express";
import userController from "../Controllers/userControllers.js";
import verifyToken from "../Auth/auth.js";
import { upload } from '../Controllers/userControllers.js'; 
//import jwt from "jsonwebtoken"

const router = express.Router();

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer token

//     if (token == null) return res.sendStatus(401); // No token, return 401

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403); // Invalid token, return 403
//         req.user = user;
//         next();
//     });
// };

//Register
router.post("/signup", userController.register )

//login
router.post("/login", userController.login)

//forgot password
router.post("/forgotpassword",userController.forgotPassword)

//add employees
router.post('/addEmployee',verifyToken,upload, userController.addEmployee)

//get employees
router.get('/getAllEmployees', verifyToken, userController.getAllEmployees)

//edit employess
router.put('/updateEmployee/:id',verifyToken, userController.updateEmployee)

//delete employee
router.delete('/deleteEmployee/:id',verifyToken, userController.deleteEmployee)

export default router;