import express from "express";
import { register, login } from "../controllers/authController.js";
import { addEmployee, getEmployees } from '../controllers/employeeController.js';


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get('/employees', getEmployees);
router.post('/employees', addEmployee);

export default router;
