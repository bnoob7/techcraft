import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from "jsonwebtoken";

// Owner Signup
export const signupOwner = async (req, res) => {
    const { owner_name, email, password, company_name } = req.body;
    const photo = req.file ? req.file.path : null; // Get uploaded photo path

    if (!owner_name || !email || !password || !company_name) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO owners (owner_name, email, password, company_name, photo) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [owner_name, email, hashedPassword, company_name, photo], (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: "Email already exists!" });
                }
                return res.status(500).json(err);
            }
            res.status(200).json({ message: "Owner signed up successfully!" });
        });
    } catch (err) {
        res.status(500).json({ message: "An error occurred!" });
    }
};


export const loginOwner = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
    }

    db.query("SELECT * FROM owners WHERE email = ?", [email], async (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        const owner = results[0];
        const isMatch = await bcrypt.compare(password, owner.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        const token = jwt.sign({ id: owner.owner_id }, "your_jwt_secret", { expiresIn: "1h" });

        // Include `owner_id` in the response
        res.status(200).json({ 
            message: "Login successful!", 
            token, 
            owner_id: owner.owner_id 
        });
    });
};


export const getOwnerDetails = (req, res) => {
    const { id } = req.params;
  
    // Query the database to fetch owner details based on owner_id
    db.query("SELECT owner_name, company_name, photo FROM owners WHERE owner_id = ?", [id], (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Owner not found!" });
      }
  
      // Successfully found the owner, send the details
      res.status(200).json(results[0]); // Return owner name, company name, and photo
    });
  };
  


