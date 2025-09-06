import express from "express";
import  {signupOwner, loginOwner } from "../controllers/ownerController.js";
import { getOwnerDetails } from "../controllers/ownerController.js";

const router = express.Router();

// Owner signup
router.post("/signup", signupOwner);

// Owner login
router.post("/login", loginOwner);

router.get("/:id", getOwnerDetails);


export default router;

// const ownerController = require("../controllers/ownerController");

