import express from "express";
import {
  upload,
  addProduct,
  getProducts,
  getOwnerByShopName,
  getPCBuildSuggestions,
  searchProducts,
  getNewestProducts,
  getGreatDeals,
  getRecommendedProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Add a product (with file upload)
router.post("/", upload.single("photo"), addProduct);

// Get all products
router.get("/pc-build", getPCBuildSuggestions); // 💡 Must come before /:param routes
router.get("/search", searchProducts); // 💡 NEW: Endpoint for combined search
router.get("/newest", getNewestProducts); // 💡 NEW: Endpoint for newest products
router.get("/deals", getGreatDeals); // 💡 NEW: Endpoint for great deals
router.post("/recommendations", getRecommendedProducts); // 💡 NEW: Endpoint for content-based recommendations
router.get("/", getProducts);
router.get("/owner/:shop_name", getOwnerByShopName);

export default router;
