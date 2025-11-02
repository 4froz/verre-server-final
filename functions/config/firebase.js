import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Validate required environment variables
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('Missing required Firebase environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Fix the private key formatting
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
    process.exit(1);
  }
}

// Helper function to verify Firebase ID token
export const verifyFirebaseToken = async (idToken) => {
  try {
    // Input validation
    if (!idToken) {
      throw new Error('Token is required');
    }
    
    if (typeof idToken !== 'string') {
      throw new Error('Token must be a string');
    }
    
    if (idToken.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = idToken.replace(/^Bearer\s+/i, '');
    
    const decodedToken = await admin.auth().verifyIdToken(cleanToken);
    
    // Additional validation
    if (!decodedToken.uid) {
      throw new Error('Invalid token: missing user ID');
    }
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
      firebase: decodedToken
    };
    
  } catch (error) {
    // Log error for debugging (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.error('Firebase token verification failed:', error.message);
    }
    
    // Throw specific errors based on Firebase error codes
    if (error.code === 'auth/id-token-expired') {
      throw new Error('Token has expired');
    } else if (error.code === 'auth/argument-error') {
      throw new Error('Invalid token format');
    } else if (error.code === 'auth/id-token-revoked') {
      throw new Error('Token has been revoked');
    } else if (error.message.includes('Token is required') ||
               error.message.includes('Token must be a string') ||
               error.message.includes('Token cannot be empty')) {
      throw error; // Re-throw our validation errors
    } else {
      throw new Error('Authentication failed');
    }
  }
};

// Helper function to get user by UID
export const getFirebaseUser = async (uid) => {
  try {
    if (!uid || typeof uid !== 'string') {
      throw new Error('Valid UID is required');
    }
    
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to get Firebase user:', error.message);
    }
    throw new Error('Failed to retrieve user information');
  }
};

// Helper function to delete Firebase user (admin only)
export const deleteFirebaseUser = async (uid) => {
  try {
    if (!uid || typeof uid !== 'string') {
      throw new Error('Valid UID is required');
    }
    
    await admin.auth().deleteUser(uid);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to delete Firebase user:', error.message);
    }
    throw new Error('Failed to delete user');
  }
};

// Helper function to verify and extract user info from request
export const extractUserFromToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header must start with Bearer');
  }
  
  const token = authHeader.substring(7);
  return await verifyFirebaseToken(token);
};

export { admin };