import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import validator from "validator";

// ✅ Login user with Firebase ID token
const loginUser = asyncHandler(async (req, res) => {
  // Firebase token already verified by middleware (req.firebaseUser exists)
  const { uid, email } = req.firebaseUser;

  // Input validation
  if (!uid || !email) {
    res.status(400);
    throw new Error("Invalid Firebase user data");
  }

  // Find user by firebaseUID
  let user = await User.findByFirebaseUID(uid);

  if (!user) {
    res.status(404);
    throw new Error("User not found. Please register first.");
  }

  // Return user data (no JWT needed - frontend keeps Firebase token)
  res.status(200).json({
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
});

// ✅ Register new user with Firebase ID token
const registerUser = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  // Firebase token already verified by middleware
  const { uid, email } = req.firebaseUser;

  // Input validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400);
    throw new Error("Name is required");
  }

  if (name.trim().length > 50) {
    res.status(400);
    throw new Error("Name cannot exceed 50 characters");
  }

  if (!uid || !email) {
    res.status(400);
    throw new Error("Invalid Firebase user data");
  }

  // Check if user already exists
  const existingUser = await User.findByFirebaseUID(uid);
  if (existingUser) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Check if email already exists (different Firebase account)
  const existingEmail = await User.findByEmail(email);
  if (existingEmail) {
    res.status(400);
    throw new Error("Email already registered with different account");
  }

  // Create new user
  const user = await User.create({
    firebaseUID: uid,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    isAdmin: false, // Default to false, admins created manually
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: user._id,
      firebaseUID: user.firebaseUID,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    }
  });
});

// ✅ Check if email exists (public endpoint)
const checkEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  // Input validation
  if (!email || typeof email !== 'string') {
    res.status(400);
    throw new Error("Email is required");
  }

  const sanitizedEmail = email.trim().toLowerCase();
  
  // Email format validation
  if (!validator.isEmail(sanitizedEmail)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  const user = await User.findByEmail(sanitizedEmail);
  
  res.status(200).json({ 
    exists: !!user,
    email: sanitizedEmail 
  });
});

// ✅ Get paginated users (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10)); // Cap at 50

  const totalUsers = await User.countDocuments();
  const users = await User.find()
    .select('firebaseUID name email isAdmin createdAt updatedAt')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    users,
    pagination: {
      page,
      limit,
      pages: Math.ceil(totalUsers / limit),
      total: totalUsers,
    }
  });
});

// ✅ Get latest users (admin only)
const getLatestUsers = asyncHandler(async (req, res) => {
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 7));
  
  const users = await User.find()
    .select('firebaseUID name email isAdmin createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json({
    success: true,
    users,
    count: users.length
  });
});

// ✅ Get current user profile
const getUserProfile = asyncHandler(async (req, res) => {
  // User already attached by protect middleware
  const user = req.user;

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
});

// ✅ Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = req.user;

  // Validate name if provided
  if (name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400);
      throw new Error("Name cannot be empty");
    }
    
    if (name.trim().length > 50) {
      res.status(400);
      throw new Error("Name cannot exceed 50 characters");
    }
    
    user.name = name.trim();
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: updatedUser._id,
      firebaseUID: updatedUser.firebaseUID,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      updatedAt: updatedUser.updatedAt,
    }
  });
});

// ✅ Delete user account
const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = req.user;

  // Prevent deleting the last admin
  if (user.isAdmin) {
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error("Cannot delete the last admin user");
    }
  }

  await User.deleteOne({ _id: user._id });

  res.json({
    success: true,
    message: "User account deleted successfully"
  });
});

export { 
  loginUser, 
  registerUser, 
  checkEmail, 
  getUsers, 
  getLatestUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount
};