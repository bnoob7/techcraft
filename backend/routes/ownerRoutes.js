import express from "express";
import multer from "multer";
import path from "path";
import { signupOwner, loginOwner, getOwnerDetails } from "../controllers/ownerController.js";

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Owner signup with photo upload
router.post("/signup", upload.single("photo"), signupOwner);

// Owner login
router.post("/login", loginOwner);

router.get("/:id", getOwnerDetails);

export default router;

