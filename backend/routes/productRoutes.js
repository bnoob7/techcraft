import express from "express";
import { addProduct, getProducts, upload } from "../controllers/productController.js";
import { getOwnerByShopName } from "../controllers/productController.js";


const router = express.Router();

// Add a product (with file upload)
router.post("/", upload.single("photo"), addProduct);



// Get all products
router.get("/", getProducts);

router.get("/owner/:shop_name", getOwnerByShopName);

export default router;
