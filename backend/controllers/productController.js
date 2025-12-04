
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
        WHERE category IN (
            'Processor (CPU)', 
            'Graphics Card (GPU)', 
            'Memory (RAM)', 
            'Motherboard', 
            'Power Supply (PSU)', 
            'Storage', 
            'Cooling System', 
            'Cabinet / Case'
        )
        ORDER BY category ASC, price ASC
    `;

    db.query(sql, [], (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching products" });
        }

        if (products.length === 0) {
            return res.status(404).json({ message: "No PC components found in the database." });
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
            "Processor (CPU)",
            "Graphics Card (GPU)",
            "Memory (RAM)",
            "Motherboard",
            "Power Supply (PSU)",
            "Storage",
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
            'Processor (CPU)': selectByIndex(categories['Processor (CPU)'], 0),
            'Graphics Card (GPU)': selectByIndex(categories['Graphics Card (GPU)'], 0),
            'Memory (RAM)': selectByIndex(categories['Memory (RAM)'], 0),
            'Motherboard': selectByIndex(categories['Motherboard'], 0),
            'Power Supply (PSU)': selectByIndex(categories['Power Supply (PSU)'], 0),
            'Storage': selectByIndex(categories['Storage'], 0),
            'Cooling System': categories['Cooling System'] ? selectByIndex(categories['Cooling System'], 0) : null,
        },
        balanced: {
            'Processor (CPU)': selectByIndex(categories['Processor (CPU)'], Math.floor(categories['Processor (CPU)'].length / 2)),
            'Graphics Card (GPU)': selectByIndex(categories['Graphics Card (GPU)'], Math.floor(categories['Graphics Card (GPU)'].length / 2)),
            'Memory (RAM)': selectByIndex(categories['Memory (RAM)'], Math.floor(categories['Memory (RAM)'].length / 2)),
            'Motherboard': selectByIndex(categories['Motherboard'], Math.floor(categories['Motherboard'].length / 2)),
            'Power Supply (PSU)': selectByIndex(categories['Power Supply (PSU)'], Math.floor(categories['Power Supply (PSU)'].length / 2)),
            'Storage': selectByIndex(categories['Storage'], Math.floor(categories['Storage'].length / 2)),
            'Cooling System': categories['Cooling System']
                ? selectByIndex(categories['Cooling System'], Math.floor(categories['Cooling System'].length / 2))
                : null,
        },
        "gpu-focused": {
            'Graphics Card (GPU)': selectByIndex(categories['Graphics Card (GPU)'], categories['Graphics Card (GPU)'].length - 1),
            'Processor (CPU)': selectByIndex(categories['Processor (CPU)'], Math.floor(categories['Processor (CPU)'].length / 2)),
            'Memory (RAM)': selectByIndex(categories['Memory (RAM)'], Math.floor(categories['Memory (RAM)'].length / 2)),
            'Motherboard': selectByIndex(categories['Motherboard'], 0),
            'Power Supply (PSU)': selectByIndex(categories['Power Supply (PSU)'], categories['Power Supply (PSU)'].length - 1),
            'Storage': selectByIndex(categories['Storage'], 0),
            'Cooling System': categories['Cooling System'] ? selectByIndex(categories['Cooling System'], 0) : null,
        },
        "cpu-focused": {
            'Processor (CPU)': selectByIndex(categories['Processor (CPU)'], categories['Processor (CPU)'].length - 1),
            'Graphics Card (GPU)': selectByIndex(categories['Graphics Card (GPU)'], Math.floor(categories['Graphics Card (GPU)'].length / 2)),
            'Memory (RAM)': selectByIndex(categories['Memory (RAM)'], categories['Memory (RAM)'].length - 1),
            'Motherboard': selectByIndex(categories['Motherboard'], 0),
            'Power Supply (PSU)': selectByIndex(categories['Power Supply (PSU)'], categories['Power Supply (PSU)'].length - 1),
            'Storage': selectByIndex(categories['Storage'], 0),
            'Cooling System': categories['Cooling System'] ? selectByIndex(categories['Cooling System'], 0) : null,
        },
        "high-end": {
            'Processor (CPU)': selectByIndex(categories['Processor (CPU)'], categories['Processor (CPU)'].length - 1),
            'Graphics Card (GPU)': selectByIndex(categories['Graphics Card (GPU)'], categories['Graphics Card (GPU)'].length - 1),
            'Memory (RAM)': selectByIndex(categories['Memory (RAM)'], categories['Memory (RAM)'].length - 1),
            'Motherboard': selectByIndex(categories['Motherboard'], categories['Motherboard'].length - 1),
            'Power Supply (PSU)': selectByIndex(categories['Power Supply (PSU)'], categories['Power Supply (PSU)'].length - 1),
            'Storage': selectByIndex(categories['Storage'], categories['Storage'].length - 1),
            'Cooling System': categories['Cooling System']
                ? selectByIndex(categories['Cooling System'], categories['Cooling System'].length - 1)
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

// 💡 NEW: Search products by name or category
export const searchProducts = (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).send("Search query is required.");
    }

    const searchTerm = `%${q}%`;
    const sql = `
        SELECT * FROM products 
        WHERE product_name LIKE ? OR category LIKE ?
    `;
    const params = [searchTerm, searchTerm];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while searching for products.");
        }
        res.status(200).send(results);
    });
};

// 💡 NEW: Get the 5 newest products
export const getNewestProducts = (req, res) => {
    const sql = `
        SELECT * FROM products 
        ORDER BY product_id DESC 
        LIMIT 5
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while fetching newest products.");
        }
        res.status(200).send(results);
    });
};

// 💡 NEW: Get products priced below their category average
export const getGreatDeals = (req, res) => {
    // Get average price for each category
    const avgPriceSql = `
        SELECT category, AVG(price) as avg_price 
        FROM products 
        GROUP BY category
    `;

    db.query(avgPriceSql, (err, avgPrices) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error calculating average prices.");
        }

        // Find products priced at least 20% below their category's average
        const conditions = avgPrices.map(cat => 
            `(p.category = '${cat.category}' AND p.price < ${cat.avg_price * 0.8})`
        ).join(' OR ');

        const dealsSql = `SELECT * FROM products p WHERE ${conditions} ORDER BY RAND() LIMIT 5`;

        db.query(dealsSql, (err, deals) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error fetching great deals.");
            }
            res.status(200).send(deals);
        });
    });
};