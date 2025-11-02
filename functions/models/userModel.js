import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    // Firebase UID - this is the primary link to Firebase Auth
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
      index: true, // Add index for faster queries
    },
    
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ firebaseUID: 1 });

// Static methods
userSchema.statics.findByFirebaseUID = function(uid) {
  return this.findOne({ firebaseUID: uid });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.createFromFirebase = async function(firebaseUser) {
  try {
    const user = new this({
      firebaseUID: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email,
    });
    
    return await user.save();
  } catch (error) {
    throw new Error(`Failed to create user from Firebase: ${error.message}`);
  }
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Trim name
  if (this.name) {
    this.name = this.name.trim();
  }
  
  next();
});

const User = mongoose.model("User", userSchema);

export default User;