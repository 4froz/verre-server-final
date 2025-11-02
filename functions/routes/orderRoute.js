import express from "express";
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getMyOrderById,
  getOrderById,
  getOrders,
  getOrderStats,
  searchOrders,
  updateOrderStatus,
 
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import Order from "../models/orderModel.js";
// import nodemailer from "nodemailer";

const router = express.Router();



// ===== USER ROUTES (Protected) =====
// Users can only access their own orders
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/my-orders/:id", protect, getMyOrderById);
router.put("/:id/cancel", protect, cancelOrder);

// ===== ADMIN ROUTES (Admin Protected) =====
// Admin analytics and management
// ===== DELIVERED ORDERS (Admin Protected) =====
router.get("/delivered", protect, admin, async (req, res) => {
  try {
    const deliveredOrders = await Order.find({ deliveryStatus: "delivered" })
      .populate("user", "name email") // optional: attach user info
      .sort({ createdAt: -1 });

    res.status(200).json(deliveredOrders);
  } catch (error) {
    console.error("Error fetching delivered orders:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/user/:userId", protect, admin, async (req, res) => {
  const { userId } = req.params;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  try {
    // Count total orders for this user (using embedded user.userId)
    const totalOrders = await Order.countDocuments({ "user.userId": userId });

    // Get paginated orders (no populate needed since user data is embedded)
    const orders = await Order.find({ "user.userId": userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        pages: Math.ceil(totalOrders / limit),
        total: totalOrders,
      }
    });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
});

router.get("/analytics/by-month", protect, admin, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const data = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const orderData = orders.find((order) => order._id === month);
      return { month, count: orderData ? orderData.count : 0 };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching orders by month:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/analytics/this-year", protect, admin, async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const totalOrders = await Order.countDocuments({
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    });
    res.status(200).json({ total: totalOrders });
  } catch (error) {
    console.error("Error fetching total sales this year:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin order management
router.get("/", protect, admin, getOrders);
router.get("/search", protect, admin, searchOrders);
router.get("/stats", protect, admin, getOrderStats);

// Bulk delete removed - no legitimate business need to delete order records

// ===== INDIVIDUAL ORDER ROUTES =====
router.route("/:id")
  .get(protect, admin, getOrderById) // Admin can see any order
  .put(protect, admin, updateOrderStatus); // Admin can update order status

// Test email route


export default router;