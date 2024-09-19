import express from "express";
import userController from "../Controllers/userControllers.js";
import auth from "../Auth/auth.js";

const router = express.Router();

//Register
router.post("/signup", userController.register )

//login
router.post("/login", userController.login)

//add employees
router.post('/addEmployee',auth.verifyToken, userController.addEmployee)

//get employees
router.get('/getAllEmployees',auth.verifyToken, userController.getAllEmployees)

//edit employess
router.put('/updateEmployee/:id',auth.verifyToken, userController.updateEmployee)

//delete employee
router.delete('/deleteEmployee/:id',auth.verifyToken, userController.deleteEmployee)

export default router;