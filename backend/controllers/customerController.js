import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from 'jsonwebtoken';

// Signup a new customer
export const signupCustomer = async (req, res) => {
    const { name, email, password, contact_number } = req.body;

    if (!name || !email || !password || !contact_number) {
        return res.status(400).send("All fields are required!");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO customers (name, email, password, contact_number) VALUES (?, ?, ?, ?)";
        db.query(sql, [name, email, hashedPassword, contact_number], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).send("Email already exists!");
                }
                return res.status(500).send(err);
            }
            res.status(200).send({ message: "Customer signed up successfully!" });
        });
    } catch (err) {
        res.status(500).send("An error occurred!");
    }
};

// Get all customers
export const getCustomers = (req, res) => {
    const sql = "SELECT id, name, email, contact_number FROM customers";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
};

// Fetch customer by ID
export const getCustomerById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT id, name, email, contact_number FROM customers WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(results[0]); // Send the customer details
  });
};



const loginCustomer = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Query the customer by email
      db.query('SELECT * FROM customers WHERE email = ?', [email], async (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }
  
        // If no customer found, return an error
        if (results.length === 0) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
  
        const customer = results[0];
  
        // Log the stored hash and the input password for debugging purposes
        console.log("Stored Hash: ", customer.password);
        console.log("Input Password: ", password);
  
        // Compare the input password (hashed) with the stored hash
        const isMatch = await bcrypt.compare(password, customer.password);
  
        // If password does not match
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
  
        // Generate JWT token for the session
        const token = jwt.sign({ id: customer.id }, 'your_jwt_secret', { expiresIn: '1h' });
  
        res.status(200).json({ message: 'Login successful', token });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
export { loginCustomer };









