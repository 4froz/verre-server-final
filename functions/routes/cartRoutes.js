import express from "express";
import { validateCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 SECURITY: Cart validation endpoint
router.route("/validate").post(protect, validateCart);

export default router;