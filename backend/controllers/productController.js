// import multer from "multer";
// import db from "../db.js";

// // Multer setup
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

// export const upload = multer({ storage });

// // Add a new product
// export const addProduct = (req, res) => {
//     const { product_name, description, price, owner_id, shop_name } = req.body;

//     if (!product_name || !description || !price || !owner_id || !shop_name) {
//         return res.status(400).send("All fields are required!");
//     }

//     const photo = req.file ? req.file.path : null; // Get the uploaded photo path

//     const sql = `
//         INSERT INTO products (product_name, description, price, photo, owner_id, shop_name)
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     db.query(sql, [product_name, description, price, photo, owner_id, shop_name], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("An error occurred while adding the product.");
//         }
//         res.status(201).send({ message: "Product added successfully!" });
//     });
// };

// // Get all products
// // export const getProducts = (req, res) => {
// //     const { owner_id } = req.query; // Get owner_id from query parameters
  
// //     if (!owner_id) {
// //         return res.status(400).send("Owner ID is required");
// //     }

// //     const sql = "SELECT * FROM products WHERE owner_id = ?";
    
// //     db.query(sql, [owner_id], (err, results) => {
// //         if (err) {
// //             console.error(err);
// //             return res.status(500).send("An error occurred while fetching products.");
// //         }
// //         res.status(200).send(results); // Send products related to the specific owner
// //     });
// // };
  


// export const getProducts = (req, res) => {
//     const { owner_id, search } = req.query; // Get both owner_id and search from query parameters

//     let sql = "SELECT * FROM products"; // Base SQL query
//     const params = []; // Parameters for the query

//     if (owner_id) {
//         // If owner_id is provided, fetch products for the specific owner
//         sql += " WHERE owner_id = ?";
//         params.push(owner_id);
//     } else if (search) {
//         // If search is provided, fetch products matching the search text
//         sql += " WHERE product_name LIKE ?";
//         params.push(`%${search}%`);
//     }

//     db.query(sql, params, (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send("An error occurred while fetching products.");
//         }
//         res.status(200).send(results); // Send the filtered products
//     });
// };


// // Function to get owner_id based on shop_name
// export const getOwnerByShopName = (req, res) => {
//     const { shop_name } = req.params;
  
//     // Query the products table for the owner_id based on shop_name
//     const sql = `
//       SELECT owner_id FROM products
//       WHERE shop_name = ? 
//       LIMIT 1
//     `;
  
//     db.query(sql, [shop_name], (err, result) => {
//       if (err) {
//         console.error("Error fetching owner ID:", err);
//         return res.status(500).json({ message: "Error fetching owner ID." });
//       }
  
//       if (result.length === 0) {
//         return res.status(404).json({ message: "Shop not found." });
//       }
  
//       // Send the owner_id as response
//       res.status(200).json({ owner_id: result[0].owner_id });
//     });
//   };






import multer from "multer";
import db from "../db.js";

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const upload = multer({ storage });

// Add a new product
export const addProduct = (req, res) => {
    // 💡 ADDED 'category' here
    const { product_name, description, price, owner_id, shop_name, category } = req.body;

    // 💡 ADDED 'category' to the required fields check
    if (!product_name || !description || !price || !owner_id || !shop_name || !category) {
        return res.status(400).send("All fields are required!");
    }

    const photo = req.file ? req.file.path : null; // Get the uploaded photo path

    const sql = `
        INSERT INTO products (product_name, description, price, photo, owner_id, shop_name, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `; // 💡 ADDED 'category' column to INSERT statement

    // 💡 ADDED 'category' value to the array
    db.query(sql, [product_name, description, price, photo, owner_id, shop_name, category], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while adding the product.");
        }
        res.status(201).send({ message: "Product added successfully!" });
    });
};

// Get all products
export const getProducts = (req, res) => {
    // 💡 ADDED 'category' to query parameters
    const { owner_id, search, category } = req.query;

    let sql = "SELECT * FROM products"; // Base SQL query
    const params = []; // Parameters for the query
    const conditions = [];

    // Build WHERE clause based on provided filters
    if (owner_id) {
        conditions.push("owner_id = ?");
        params.push(owner_id);
    }
    if (search) {
        conditions.push("product_name LIKE ?");
        params.push(`%${search}%`);
    }
    // 💡 ADDED condition for category filter
    if (category) {
        conditions.push("category = ?");
        params.push(category);
    }

    // Combine all conditions with ' AND '
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while fetching products.");
        }
        res.status(200).send(results); // Send the filtered products
    });
};


// Function to get owner_id based on shop_name (No change needed here as it doesn't involve 'category')
export const getOwnerByShopName = (req, res) => {
    const { shop_name } = req.params;

    // Query the products table for the owner_id based on shop_name
    const sql = `
      SELECT owner_id FROM products
      WHERE shop_name = ? 
      LIMIT 1
    `;

    db.query(sql, [shop_name], (err, result) => {
        if (err) {
            console.error("Error fetching owner ID:", err);
            return res.status(500).json({ message: "Error fetching owner ID." });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Shop not found." });
        }

        // Send the owner_id as response
        res.status(200).json({ owner_id: result[0].owner_id });
    });
};