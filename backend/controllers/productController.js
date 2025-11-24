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

        res.status(200).json({ owner_id: result[0].owner_id });
    });
};

// 💡 NEW: Get PC build suggestions based on budget
export const getPCBuildSuggestions = (req, res) => {
    const { budget } = req.query;

    if (!budget || isNaN(budget)) {
        return res.status(400).json({ message: "Valid budget is required" });
    }

    const budgetAmount = parseInt(budget, 10);

    // Fetch all products grouped by category within budget
    const sql = `
        SELECT * FROM products 
        WHERE category IN ('cpu', 'gpu', 'ram', 'motherboard', 'psu', 'storage', 'cooling')
        AND price <= ?
        ORDER BY category ASC, price ASC
    `;

    db.query(sql, [budgetAmount], (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching products" });
        }

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found within budget" });
        }

        // Group products by category
        const categories = {};
        products.forEach((product) => {
            if (!categories[product.category]) {
                categories[product.category] = [];
            }
            categories[product.category].push(product);
        });

        // Validate that we have all required categories
        const requiredCategories = [
            "cpu",
            "gpu",
            "ram",
            "motherboard",
            "psu",
            "storage",
        ];
        const missingCategories = requiredCategories.filter(
            (cat) => !categories[cat] || categories[cat].length === 0
        );

        if (missingCategories.length > 0) {
            return res.status(404).json({
                message: `Not enough products to build a PC. Missing: ${missingCategories.join(
                    ", "
                )}`,
            });
        }

        // Generate 5 different PC build configurations
        const builds = [];

        builds.push(generateBuild(categories, budgetAmount, "budget"));
        builds.push(generateBuild(categories, budgetAmount, "balanced"));
        builds.push(generateBuild(categories, budgetAmount, "gpu-focused"));
        builds.push(generateBuild(categories, budgetAmount, "cpu-focused"));
        builds.push(generateBuild(categories, budgetAmount, "high-end"));

        res.status(200).json(builds);
    });
};

// Helper function to generate a single PC build
function generateBuild(categories, budget, buildType) {
    const components = {};
    let totalCost = 0;

    // Selection strategy based on build type
    const strategies = {
        budget: {
            cpu: selectByIndex(categories.cpu, 0),
            gpu: selectByIndex(categories.gpu, 0),
            ram: selectByIndex(categories.ram, 0),
            motherboard: selectByIndex(categories.motherboard, 0),
            psu: selectByIndex(categories.psu, 0),
            storage: selectByIndex(categories.storage, 0),
            cooling: categories.cooling ? selectByIndex(categories.cooling, 0) : null,
        },
        balanced: {
            cpu: selectByIndex(categories.cpu, Math.floor(categories.cpu.length / 2)),
            gpu: selectByIndex(categories.gpu, Math.floor(categories.gpu.length / 2)),
            ram: selectByIndex(categories.ram, Math.floor(categories.ram.length / 2)),
            motherboard: selectByIndex(
                categories.motherboard,
                Math.floor(categories.motherboard.length / 2)
            ),
            psu: selectByIndex(categories.psu, Math.floor(categories.psu.length / 2)),
            storage: selectByIndex(
                categories.storage,
                Math.floor(categories.storage.length / 2)
            ),
            cooling: categories.cooling
                ? selectByIndex(categories.cooling, Math.floor(categories.cooling.length / 2))
                : null,
        },
        "gpu-focused": {
            gpu: selectByIndex(categories.gpu, categories.gpu.length - 1),
            cpu: selectByIndex(categories.cpu, Math.floor(categories.cpu.length / 2)),
            ram: selectByIndex(categories.ram, Math.floor(categories.ram.length / 2)),
            motherboard: selectByIndex(categories.motherboard, 0),
            psu: selectByIndex(categories.psu, categories.psu.length - 1),
            storage: selectByIndex(categories.storage, 0),
            cooling: categories.cooling ? selectByIndex(categories.cooling, 0) : null,
        },
        "cpu-focused": {
            cpu: selectByIndex(categories.cpu, categories.cpu.length - 1),
            gpu: selectByIndex(categories.gpu, Math.floor(categories.gpu.length / 2)),
            ram: selectByIndex(categories.ram, categories.ram.length - 1),
            motherboard: selectByIndex(categories.motherboard, 0),
            psu: selectByIndex(categories.psu, categories.psu.length - 1),
            storage: selectByIndex(categories.storage, 0),
            cooling: categories.cooling ? selectByIndex(categories.cooling, 0) : null,
        },
        "high-end": {
            cpu: selectByIndex(categories.cpu, categories.cpu.length - 1),
            gpu: selectByIndex(categories.gpu, categories.gpu.length - 1),
            ram: selectByIndex(categories.ram, categories.ram.length - 1),
            motherboard: selectByIndex(
                categories.motherboard,
                categories.motherboard.length - 1
            ),
            psu: selectByIndex(categories.psu, categories.psu.length - 1),
            storage: selectByIndex(categories.storage, categories.storage.length - 1),
            cooling: categories.cooling
                ? selectByIndex(categories.cooling, categories.cooling.length - 1)
                : null,
        },
    };

    const strategy = strategies[buildType] || strategies.balanced;

    // Collect selected components
    Object.values(strategy).forEach((component) => {
        if (component) {
            components[component.category] = component;
            totalCost += parseFloat(component.price);
        }
    });

    // Ensure total cost doesn't exceed budget
    if (totalCost > budget) {
        Object.keys(components).forEach((category) => {
            if (components[category].price > budget * 0.2) {
                components[category] = selectByIndex(categories[category], 0);
            }
        });
        totalCost = Object.values(components).reduce(
            (sum, c) => sum + parseFloat(c.price),
            0
        );
    }

    return {
        buildType,
        totalCost: totalCost.toFixed(2),
        remainingBudget: (budget - totalCost).toFixed(2),
        components: Object.values(components),
    };
}

// Helper to safely select by index
function selectByIndex(array, index) {
    return array[Math.min(index, array.length - 1)];
}