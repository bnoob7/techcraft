import db from "../db.js";

// Add item to cart
export const addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

  db.query(sql, [user_id, product_id, quantity, quantity], (err, result) => {
    if (err) {
      console.error("Error adding to cart:", err);
      return res.status(500).json({ message: "Failed to add item to cart." });
    }

    res.status(200).json({ message: "Item added to cart successfully!" });
  });
};

// // Get cart items for a specific user
// export const getCartItems = (req, res) => {
//   const { userId } = req.params;

//   const sql = `
//     SELECT c.quantity, p.product_id, p.product_name, p.description, p.price, p.photo
//     FROM cart c
//     JOIN products p ON c.product_id = p.product_id
//     WHERE c.user_id = ?`;

//   db.query(sql, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching cart items:", err);
//       return res.status(500).json({ message: "Failed to fetch cart items." });
//     }

//     res.status(200).json(results);
//   });
// };

// Get cart items for a specific user
export const getCartItems = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.product_id, 
      SUM(c.quantity) AS quantity, 
      p.product_name, 
      p.description, 
      p.price, 
      p.photo, 
      p.shop_name
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = ?
    GROUP BY c.product_id, p.product_name, p.description, p.price, p.photo, p.shop_name`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ message: "Failed to fetch cart items." });
    }

    // Structure the data in the desired JSON format
    const groupedItems = results.reduce((acc, item) => {
      const { shop_name, ...productData } = item;
      if (!acc[shop_name]) {
        acc[shop_name] = [];
      }
      acc[shop_name].push(productData);
      return acc;
    }, {});

    res.status(200).json({ cart: groupedItems });
  });
};

