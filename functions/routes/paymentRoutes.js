import express from "express";
import { 
  getPaymentConfig, 
  createPaymentOrder, 
  verifyPayment,
  handleWebhook 
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for Razorpay config
router.route("/config").get(getPaymentConfig);

// Webhook route (should be before other routes to avoid middleware conflicts)
router.route("/webhook").post(express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.route("/create-order").post(protect, createPaymentOrder);
router.route("/verify").post(protect, verifyPayment);

export default router;