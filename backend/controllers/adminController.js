import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Admin signup
export const signupAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send("All fields are required!");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)";
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).send("Email already exists!");
                }
                return res.status(500).send(err);
            }
            res.status(200).send({ message: "Admin signed up successfully!" });
        });
    } catch (err) {
        res.status(500).send("An error occurred!");
    }
};

// Admin login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields are required!");
    }

    try {
        db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
            if (err) return res.status(500).send(err);

            if (results.length === 0) {
                return res.status(400).send("Invalid email or password!");
            }

            const admin = results[0];
            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(400).send("Invalid email or password!");
            }

            const token = jwt.sign({ id: admin.admin_id }, "your_jwt_secret", { expiresIn: "1h" });
            res.status(200).send({ message: "Login successful", token });
        });
    } catch (err) {
        res.status(500).send("An error occurred!");
    }
};










