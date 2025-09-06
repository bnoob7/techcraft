import express from "express";
import { signupCustomer, getCustomers, loginCustomer, getCustomerById } from "../controllers/customerController.js";

const router = express.Router();

// Route to signup a new customer
router.post("/signup", signupCustomer);

// Route to fetch all customers
router.get("/", getCustomers);

// POST request to login customer
router.post('/login', loginCustomer);

// Route to fetch a specific customer by ID
router.get('/:id', getCustomerById);

export default router;
