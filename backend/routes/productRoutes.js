import express from "express";
import {
  upload,
  addProduct,
  getProducts,
  getOwnerByShopName,
  getPCBuildSuggestions,
} from "../controllers/productController.js";

const router = express.Router();

// Add a product (with file upload)
router.post("/", upload.single("photo"), addProduct);

// Get all products
router.get("/pc-build", getPCBuildSuggestions); // 💡 Must come before /:param routes
router.get("/", getProducts);
router.get("/owner/:shop_name", getOwnerByShopName);

export default router;
