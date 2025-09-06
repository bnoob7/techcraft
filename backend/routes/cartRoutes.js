import express from "express";
import { addToCart, getCartItems } from "../controllers/cartController.js";

const router = express.Router();

// Route to add an item to the cart
router.post("/add", addToCart);

// Route to fetch cart items for a specific user
router.get("/:userId", getCartItems);

export default router;
