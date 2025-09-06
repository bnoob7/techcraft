import db from "../db.js";

// Function to add a new order to the database
export const addOrder = (req, res) => {
  const { customer_id, shop_name, items, total_amount, owner_id } = req.body;

  if (!customer_id || !shop_name || !items || !total_amount || !owner_id) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `
    INSERT INTO orders (customer_id, shop_name, items, total_amount, owner_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [customer_id, shop_name, JSON.stringify(items), total_amount, owner_id],
    (err, result) => {
      if (err) {
        console.error("Error adding order:", err);
        return res.status(500).json({ message: "Failed to add order." });
      }

      res.status(200).json({ message: "Order placed successfully!" });
    }
  );
};

// Function to fetch orders by owner ID
export const getOrdersByOwnerId = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      orders.order_id, 
      orders.shop_name, 
      orders.total_amount, 
      orders.order_date, 
      customers.name 
    FROM orders
    JOIN customers ON orders.customer_id = customers.id
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Failed to fetch orders." });
    }

    res.status(200).json(results); // Send the orders to the frontend
  });
};
