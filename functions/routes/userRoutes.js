import express from "express";
import asyncHandler from "express-async-handler";
import validator from "validator";
const router = express.Router();

// Import controllers
import {
  checkEmail,
  getLatestUsers,
  getUsers,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../controllers/userController.js";

// Import middleware (using the corrected names)
import { protect, admin, verifyFirebaseForAuth } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

// ===== PUBLIC ROUTES =====
// Check if email exists (no auth needed)
router.post("/check-email", checkEmail);

// Auth routes (Firebase verification required)
router.post("/register", verifyFirebaseForAuth, registerUser);
router.post("/login", verifyFirebaseForAuth, loginUser);

// ===== PROTECTED USER ROUTES =====
// User profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/account", protect, deleteUserAccount);

// ===== ADMIN ROUTES =====
// Get all users (paginated)
router.get("/", protect, admin, getUsers);

// Get latest users
router.get("/latest", protect, admin, getLatestUsers);

// Get user count
router.get("/count", protect, admin, asyncHandler(async (req, res) => {
  const total = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ isAdmin: true });
  
  res.status(200).json({
    success: true,
    stats: {
      total,
      active: activeUsers,
      admins: adminUsers,
    }
  });
}));

// Search users (admin only)
router.post("/search", protect, admin, asyncHandler(async (req, res) => {
  const { query } = req.body;

  // Input validation
  if (!query || typeof query !== 'string' || query.trim() === "") {
    res.status(400);
    throw new Error("Valid search query is required");
  }

  const sanitizedQuery = query.trim();
  
  // Prevent overly long queries (DoS protection)
  if (sanitizedQuery.length > 100) {
    res.status(400);
    throw new Error("Search query too long (max 100 characters)");
  }

  // Escape special regex characters to prevent ReDoS attacks
  const escapedQuery = sanitizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Safe search with limits
  const users = await User.find({
    $or: [
      { name: { $regex: escapedQuery, $options: "i" } },
      { email: { $regex: escapedQuery, $options: "i" } },
    ],
  })
  .select('firebaseUID name email isAdmin createdAt')
  .limit(50); // Limit results

  res.status(200).json({
    success: true,
    query: sanitizedQuery,
    results: users,
    count: users.length
  });
}));

// ===== ADMIN CRUD ROUTES =====
router.route("/admin/:firebaseUID")
  .get(protect, admin, asyncHandler(async (req, res) => {
    const { firebaseUID } = req.params;
    
    // Validate Firebase UID format
    if (!firebaseUID || firebaseUID.length < 10 || firebaseUID.length > 128) {
      res.status(400);
      throw new Error("Invalid Firebase UID format");
    }

    const user = await User.findByFirebaseUID(firebaseUID);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        firebaseUID: user.firebaseUID,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  }))
  .put(protect, admin, asyncHandler(async (req, res) => {
    const { firebaseUID } = req.params;
    const { name, email, isAdmin } = req.body;

    // Validate Firebase UID
    if (!firebaseUID || firebaseUID.length < 10 || firebaseUID.length > 128) {
      res.status(400);
      throw new Error("Invalid Firebase UID format");
    }

    const user = await User.findByFirebaseUID(firebaseUID);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Input validation and sanitization
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 50) {
        res.status(400);
        throw new Error("Name must be 1-50 characters");
      }
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Invalid email format");
      }
      
      // Check if email is already used by another user
      const existingEmailUser = await User.findByEmail(email);
      if (existingEmailUser && existingEmailUser.firebaseUID !== firebaseUID) {
        res.status(400);
        throw new Error("Email already in use by another user");
      }
      
      user.email = email.toLowerCase().trim();
    }

    if (isAdmin !== undefined) {
      if (typeof isAdmin !== 'boolean') {
        res.status(400);
        throw new Error("isAdmin must be boolean");
      }
      
      // Prevent removing admin status from last admin
      if (!isAdmin && user.isAdmin) {
        const adminCount = await User.countDocuments({ isAdmin: true });
        if (adminCount <= 1) {
          res.status(400);
          throw new Error("Cannot remove admin status from the last admin");
        }
      }
      
      user.isAdmin = isAdmin;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        firebaseUID: updatedUser.firebaseUID,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        updatedAt: updatedUser.updatedAt,
      }
    });
  }))
  .delete(protect, admin, asyncHandler(async (req, res) => {
    const { firebaseUID } = req.params;
    
    // Validate Firebase UID
    if (!firebaseUID || firebaseUID.length < 10 || firebaseUID.length > 128) {
      res.status(400);
      throw new Error("Invalid Firebase UID format");
    }

    const user = await User.findByFirebaseUID(firebaseUID);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Prevent deleting the last admin
    if (user.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        res.status(400);
        throw new Error("Cannot delete the last admin user");
      }
    }

    // Prevent admin from deleting themselves
    if (user.firebaseUID === req.user.firebaseUID) {
      res.status(400);
      throw new Error("Cannot delete your own account via admin panel");
    }

    await User.deleteOne({ _id: user._id });
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  }));

export default router;