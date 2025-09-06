import express from "express";
import { addOrder, getOrdersByOwnerId } from "../controllers/orderController.js";

const router = express.Router();

// Route to add a new order
router.post("/add", addOrder);

// Route to fetch orders for a specific owner
router.get("/owner/:id", getOrdersByOwnerId);

export default router;
