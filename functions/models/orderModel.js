import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    // Keep user data embedded for order history even if user deleted
    user: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      userId: { type: String, required: true },
    },

    orderItems: [
      {
        name: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        qty: { type: Number, required: true, min: 1 },
        _id: false // Disable _id for sub-documents
      },
    ],

    shippingAddress: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      _id: false
    },

    paymentMethod: { 
      type: String, 
      required: true,
      enum: ["online", "cod"],
      lowercase: true 
    },

    deliveryMethod: {
      type: String,
      required: true,
      enum: ["regular", "express"],
      default: "regular",
      lowercase: true
    },

    orderId: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },

    // Pricing
    itemsPrice: { type: Number, required: true, min: 0, default: 0 },
    shippingPrice: { type: Number, required: true, min: 0, default: 0 },
    totalPrice: { type: Number, required: true, min: 0, default: 0 },

    // Status tracking with dates
    deliveryStatus: { 
      type: String, 
      required: true, 
      enum: ["pending", "processing", "out for delivery", "delivered", "cancelled", "cancelled by admin"],
      default: "pending",
      lowercase: true 
    },

    // Status change tracking
    statusHistory: [{
      status: {
        type: String,
        enum: ["pending", "processing", "out for delivery", "delivered", "cancelled", "cancelled by admin"],
        required: true
      },
      date: { type: Date, default: Date.now },
      note: { type: String, trim: true }, // Optional note for status change
      _id: false
    }],

    // Delivery tracking
    isCancelled: { type: Boolean, default: false },
    trackingId: { type: String, default: "", trim: true },
    deliveredAt: { type: Date },
    
    // Estimated delivery time in days
    estTime: { type: Number, default: 14, min: 1 },

    // Payment tracking
  
    paymentId: { type: String, trim: true }, // For online payments

    // Cancellation tracking
    cancelledAt: { type: Date },
    cancelReason: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
orderSchema.index({ "user.userId": 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ deliveryStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "user.email": 1 });

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('deliveryStatus')) {
    // Check if we already have this status to avoid duplicates
    const lastStatus = this.statusHistory[this.statusHistory.length - 1];
    const isDuplicate = lastStatus && 
      lastStatus.status === this.deliveryStatus && 
      (Date.now() - new Date(lastStatus.date)) < 1000; // Within 1 second
    
    if (!isDuplicate) {
      this.statusHistory.push({
        status: this.deliveryStatus,
        date: new Date(),
        note: this._statusNote || '' // Use note if provided via updateStatus method
      });
    }
    
    // Clean up temporary property
    delete this._statusNote;
    
    // Update relevant fields based on status
    if (this.deliveryStatus === 'delivered') {
      this.deliveredAt = new Date();
    } else if (this.deliveryStatus === 'cancelled' || this.deliveryStatus === 'cancelled by admin') {
      this.isCancelled = true;
      this.cancelledAt = new Date();
    }
  }
  next();
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to update status with note - fixed to prevent duplicates
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  // Store the note temporarily for pre-save middleware to use
  this._statusNote = note;
  
  // Only update deliveryStatus - let pre-save middleware handle statusHistory
  this.deliveryStatus = newStatus;
  
  return this.save();
};

const Order = mongoose.model("Order", orderSchema);
export default Order;