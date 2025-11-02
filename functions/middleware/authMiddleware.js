import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { verifyFirebaseToken } from '../config/firebase.js';

// Protect routes using Firebase ID tokens
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Basic token validation
      if (!token || token.length < 10) {
        res.status(401);
        throw new Error('Invalid token format');
      }

      // Verify Firebase ID token
      const decodedFirebase = await verifyFirebaseToken(token);

      // Validate required Firebase fields
      if (!decodedFirebase.uid) {
        res.status(401);
        throw new Error('Invalid Firebase token: missing user ID');
      }

      // Find user in MongoDB using Firebase UID
      const user = await User.findByFirebaseUID(decodedFirebase.uid);
      
      if (!user) {
        res.status(404);
        throw new Error('User not found in database. Please register first.');
      }

      // Attach both Firebase and MongoDB user data to request
      req.user = user;
      req.firebaseUser = decodedFirebase;
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      
      // Handle specific error types
      if (error.message.includes('expired')) {
        throw new Error('Firebase token has expired');
      } else if (error.message.includes('revoked')) {
        throw new Error('Firebase token has been revoked');
      } else if (error.message.includes('Invalid token format')) {
        throw new Error('Invalid token format');
      } else if (error.message.includes('User not found')) {
        throw new Error('User not found in database. Please register first.');
      } else {
        throw new Error('Not authorized, invalid Firebase token');
      }
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// Admin-only routes middleware
const admin = asyncHandler(async (req, res, next) => {
  // Check if user exists and is admin
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  if (!req.user.isAdmin) {
    res.status(403);
    throw new Error('Access denied. Admin privileges required');
  }

  next();
});

// Firebase ID token verification for login/register routes
const verifyFirebaseForAuth = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  
  // Input validation
  if (!idToken) {
    res.status(400);
    throw new Error('Firebase ID token is required');
  }

  if (typeof idToken !== 'string' || idToken.trim().length === 0) {
    res.status(400);
    throw new Error('Valid Firebase ID token required');
  }

  try {
    // Verify Firebase ID token
    const decodedFirebase = await verifyFirebaseToken(idToken.trim());

    // Validate required fields from Firebase
    if (!decodedFirebase.uid) {
      res.status(401);
      throw new Error('Invalid Firebase token: missing user ID');
    }

    if (!decodedFirebase.email) {
      res.status(401);
      throw new Error('Invalid Firebase token: missing email');
    }

    // Attach Firebase user data to request
    req.firebaseUser = decodedFirebase;
    next();
    
  } catch (error) {
    console.error('Firebase verification error:', error.message);
    res.status(401);
    
    // Handle specific Firebase errors
    if (error.message.includes('expired')) {
      throw new Error('Firebase token has expired');
    } else if (error.message.includes('revoked')) {
      throw new Error('Firebase token has been revoked');
    } else {
      throw new Error('Invalid Firebase token');
    }
  }
});

// Optional: Middleware to check if user exists in database (for protected routes)
const ensureUserExists = asyncHandler(async (req, res, next) => {
  if (!req.firebaseUser) {
    res.status(401);
    throw new Error('Firebase user data not found');
  }

  // Check if user exists in MongoDB
  let user = await User.findByFirebaseUID(req.firebaseUser.uid);

  // If user doesn't exist, create them automatically
  if (!user) {
    try {
      user = await User.create({
        firebaseUID: req.firebaseUser.uid,
        name: req.firebaseUser.name || 'New User',
        email: req.firebaseUser.email,
        isAdmin: false,
      });
      console.log('Created new user from Firebase:', user._id);
    } catch (error) {
      console.error('Failed to create user:', error);
      res.status(500);
      throw new Error('Failed to create user in database');
    }
  }

  req.user = user;
  next();
});

export { protect, admin, verifyFirebaseForAuth, ensureUserExists };