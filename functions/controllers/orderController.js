import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { 
  sendNewOrderNotificationToAdmin, 
  sendOrderOutForDeliveryEmail, 
  sendOrderDeliveredEmail, 
  sendOrderCancelledByAdminEmail,
  sendOrderCancelledNotificationToAdmin,
} from "../config/emailService.js";
import Product from "../models/productModel.js";

// ========== USER ROUTES (Customer facing) ==========

// Create new order - USER ONLY
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    deliveryMethod = "regular",
    paymentId
  } = req.body;

  // Basic input validation
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }
  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Shipping address and payment method are required");
  }
  if (!["online", "cod"].includes(paymentMethod.toLowerCase())) {
    res.status(400);
    throw new Error("Invalid payment method. Use 'online' or 'cod'");
  }
  if (!["regular", "express"].includes(deliveryMethod.toLowerCase())) {
    res.status(400);
    throw new Error("Invalid delivery method. Use 'regular' or 'express'");
  }

  // Validate order items against database
  const validatedOrderItems = [];
  let calculatedSubtotal = 0;

  for (const item of orderItems) {
    const { productId, qty, variant = "default" } = item;

    if (!productId || !qty || qty <= 0) {
      res.status(400);
      throw new Error("Missing or invalid product ID or quantity");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${productId}`);
    }
    if (!product.inStock) {
      res.status(400);
      throw new Error(`Product out of stock: ${product.name}`);
    }

    const serverPrice = product.price;
    const itemTotal = serverPrice * qty;
    calculatedSubtotal += itemTotal;

    validatedOrderItems.push({
      name: product.name,
      qty: Number(qty),
      image: product.img && product.img[0] ? product.img[0] : '',
      price: serverPrice,
      product: product._id,
      variant: String(variant).trim()
    });
  }

  // Calculate delivery price
  const shippingPrice = deliveryMethod.toLowerCase() === "express" ? 140 : 70;
  const totalPrice = calculatedSubtotal + shippingPrice;

  // Generate unique order ID
  let orderId, attempts = 0;
  const maxAttempts = 5;
  do {
    orderId = "42" + crypto.randomBytes(4).toString("hex").toUpperCase();
    attempts++;
    if (attempts >= maxAttempts) {
      res.status(500);
      throw new Error("Failed to generate unique order ID");
    }
  } while (await Order.findOne({ orderId }));

  // Create order object
  const orderData = {
    orderId,
    orderItems: validatedOrderItems,
    user: {
      name: String(req.user.name || '').trim(),
      email: String(req.user.email || '').trim().toLowerCase(),
      userId: req.user.firebaseUID || req.user._id.toString()
    },
    shippingAddress: {
      address: String(shippingAddress.address || '').trim(),
      city: String(shippingAddress.city || '').trim(),
      state: String(shippingAddress.state || '').trim(),
      zipCode: String(shippingAddress.zipCode || '').trim()
    },
    paymentMethod: paymentMethod.toLowerCase(),
    deliveryMethod: deliveryMethod.toLowerCase(),
    itemsPrice: calculatedSubtotal,
    shippingPrice,
    totalPrice
  };

  // Add payment info for online payments
  if (paymentMethod.toLowerCase() === "online" && paymentId) {
    orderData.paymentId = String(paymentId).trim();
  }

  const order = new Order(orderData);
  const createdOrder = await order.save();

  // Send email notification to admin
  try {
    const emailResult = await sendNewOrderNotificationToAdmin(createdOrder);
    if (emailResult.success) {
      console.log("📧 New order notification sent to admin successfully");
    } else {
      console.error("📧 Failed to send new order notification:", emailResult.error);
    }
  } catch (emailError) {
    console.error("📧 Email notification error:", emailError);
    // Don't fail order creation due to email issues
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order: createdOrder
  });
});

// Get user's own orders - USER ONLY
const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  // Get user ID from authenticated user
  const userId = req.user.firebaseUID || req.user._id.toString();

  const query = { "user.userId": userId };

  const totalOrders = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    orders,
    pagination: {
      page,
      pages: Math.ceil(totalOrders / limit),
      total: totalOrders,
      hasMore: page < Math.ceil(totalOrders / limit)
    }
  });
});

// Get specific order details - USER ONLY (own orders)
const getMyOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.firebaseUID || req.user._id.toString();

  // Find order and verify ownership
  const order = await Order.findOne({
    $and: [
      { $or: [{ _id: orderId }, { orderId: orderId }] },
      { "user.userId": userId }
    ]
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found or access denied");
  }

  res.json({
    success: true,
    order
  });
});

// Cancel order - USER ONLY (own orders)
const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.firebaseUID || req.user._id.toString();
  const { reason } = req.body;

  // Find user's order
  const order = await Order.findOne({
    $and: [
      { $or: [{ _id: orderId }, { orderId: orderId }] },
      { "user.userId": userId }
    ]
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found or access denied");
  }

  // Check if order can be cancelled
  const cancelableStatuses = ["pending", "processing"];
  if (!cancelableStatuses.includes(order.deliveryStatus)) {
    res.status(400);
    throw new Error(`Order cannot be cancelled. Current status: ${order.deliveryStatus}`);
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error("Order is already cancelled");
  }

  // Use model method to update status with reason
  const cancelReason = reason || 'Cancelled by customer';
  await order.updateStatus('cancelled', cancelReason);
  
  // Set additional cancellation fields
  order.cancelReason = cancelReason;
  await order.save();

  // Send email notification to admin
  try {
    const emailResult = await sendOrderCancelledNotificationToAdmin(order);
    if (emailResult.success) {
      console.log('📧 Order cancellation notification sent to admin');
    } else {
      console.error('📧 Failed to send cancellation notification:', emailResult.error);
    }
  } catch (emailError) {
    console.error('📧 Cancellation email error:', emailError);
    // Don't fail the cancellation if email fails
  }

  res.json({
    success: true,
    message: "Order cancelled successfully",
    order
  });
});

// ========== ADMIN ROUTES ==========

// Get all orders with filters - ADMIN ONLY
const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
  const sort = req.query.sort || "All Orders";
  const allOrders = req.query.allOrders === "true";

  const query = {};

  // Filter by delivery status
  const validStatuses = ["pending", "processing", "out for delivery", "delivered", "cancelled", "cancelled by admin"];
  if (validStatuses.includes(sort.toLowerCase())) {
    query.deliveryStatus = sort.toLowerCase();
  }

  // Date filters
  if (sort === "Today") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    query.createdAt = { $gte: today, $lt: tomorrow };
  }

  if (sort === "This Month") {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    query.createdAt = { $gte: firstDay, $lt: lastDay };
  }

  // Return all orders if requested (for exports, analytics)
  if (allOrders) {
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(1000); // Safety limit

    return res.json({
      success: true,
      orders,
      total: orders.length
    });
  }

  // Paginated results
  const totalOrders = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    orders,
    pages: Math.ceil(totalOrders / limit),
    pagination: {
      page,
      pages: Math.ceil(totalOrders / limit),
      total: totalOrders
    }
  });
});

// Get any order by ID - ADMIN ONLY
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({
    $or: [{ _id: orderId }, { orderId: orderId }]
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({
    success: true,
    order
  });
});

// Update order status - ADMIN ONLY
const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status, note, trackingId } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  const validStatuses = ["pending", "processing", "out for delivery", "delivered", "cancelled", "cancelled by admin"];
  const normalizedStatus = status.toLowerCase();
  
  if (!validStatuses.includes(normalizedStatus)) {
    res.status(400);
    throw new Error(`Invalid status. Valid statuses: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findOne({
    $or: [{ _id: orderId }, { orderId: orderId }]
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Use model method to update status with note
  const statusNote = note || `Status updated by admin to ${status}`;
  await order.updateStatus(normalizedStatus, statusNote);
  
  // Update tracking ID if provided
  if (trackingId && String(trackingId).trim()) {
    order.trackingId = String(trackingId).trim();
  }

  // Set cancel reason for cancelled by admin status
  if (normalizedStatus === 'cancelled by admin') {
    order.cancelReason = statusNote;
  }

  await order.save();

  // Send email notifications to customer based on status change
  try {
    const customerEmail = order.user?.email;
    console.log(`🔄 Status changed to: ${normalizedStatus} for order ${order.orderId}`);
    console.log(`👤 Customer email: ${customerEmail}`);
    
    let emailResult;
    
    switch (normalizedStatus) {
      case 'out for delivery':
        console.log('📧 Sending "out for delivery" email to customer...');
        emailResult = await sendOrderOutForDeliveryEmail(order);
        break;
        
      case 'delivered':
        console.log('📧 Sending "delivered" email to customer...');
        emailResult = await sendOrderDeliveredEmail(order);
        break;
        
      case 'cancelled by admin':
        console.log('📧 Sending "cancelled by admin" email to customer...');
        emailResult = await sendOrderCancelledByAdminEmail(order);
        
        // Also notify admin about the cancellation
        console.log('📧 Sending cancellation notification to admin...');
        const adminEmailResult = await sendOrderCancelledNotificationToAdmin(order);
        if (adminEmailResult.success) {
          console.log('📧 Admin cancellation notification sent');
        } else {
          console.error('📧 Failed to send admin cancellation notification:', adminEmailResult.error);
        }
        break;
        
      default:
        console.log(`📧 No email notification configured for status: ${normalizedStatus}`);
        break;
    }
    
    if (emailResult) {
      if (emailResult.success) {
        console.log(`📧 Customer email notification sent successfully (${emailResult.method || 'unknown method'})`);
        if (emailResult.message) {
          console.log(`📧 Email note: ${emailResult.message}`);
        }
      } else {
        console.error(`📧 Failed to send customer email notification: ${emailResult.error}`);
      }
    }
    
  } catch (emailError) {
    console.error('❌ Failed to send status update email notification:', emailError);
    // Don't fail the status update if email fails
  }

  res.json({
    success: true,
    message: `Order status updated to ${status} successfully`,
    order
  });
});

// Search orders - ADMIN ONLY
const searchOrders = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim();
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  if (!q || q.length < 2) {
    res.status(400);
    throw new Error("Search query must be at least 2 characters long");
  }

  // Escape special regex characters for safe searching
  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQuery, "i");

  const query = {
    $or: [
      { "user.name": { $regex: regex } },
      { "user.email": { $regex: regex } },
      { orderId: { $regex: regex } }
    ]
  };

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    orders,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// Get orders statistics - ADMIN ONLY
const getOrderStats = asyncHandler(async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$deliveryStatus",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalPrice" }
        }
      }
    ]);

    // Calculate additional useful statistics
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { deliveryStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Get delivered orders count for backward compatibility
    const deliveredCount = stats.find(s => s._id === "delivered")?.count || 0;
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get this month's orders
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const thisMonthOrders = await Order.countDocuments({
      createdAt: { $gte: firstDay, $lt: lastDay }
    });

    res.json({
      success: true,
      stats,
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        deliveredOrders: deliveredCount,
        todayOrders,
        thisMonthOrders
      },
      // For backward compatibility
      deliveredOrders: deliveredCount
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500);
    throw new Error('Failed to get order statistics');
  }
});

// Test email function - ADMIN ONLY (for development/testing)
const testEmail = asyncHandler(async (req, res) => {
  const { email, templateName = 'orderOutForDelivery' } = req.body;
  
  if (!email) {
    res.status(400);
    throw new Error("Email is required for testing");
  }
  
  console.log(`🧪 Testing email template '${templateName}' to:`, email);
  
  // Create test order data
  const testOrderData = {
    orderId: 'TEST' + Date.now(),
    user: {
      name: 'Test Customer',
      email: email
    },
    totalPrice: 1500,
    orderItems: [
      { 
        name: 'Test Product 1', 
        qty: 2, 
        price: 500 
      },
      { 
        name: 'Test Product 2', 
        qty: 1, 
        price: 500 
      }
    ],
    shippingAddress: {
      address: '123 Test Street, Test Building',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    },
    paymentMethod: 'cod',
    deliveryMethod: 'regular',
    createdAt: new Date(),
    deliveryStatus: 'processing',
    trackingId: 'TEST123456789',
    cancelReason: 'Test cancellation reason'
  };
  
  try {
    let result;
    
    switch (templateName) {
      case 'orderOutForDelivery':
        result = await sendOrderOutForDeliveryEmail(testOrderData);
        break;
      case 'orderDelivered':
        result = await sendOrderDeliveredEmail(testOrderData);
        break;
      case 'orderCancelledByAdmin':
        result = await sendOrderCancelledByAdminEmail(testOrderData);
        break;
      case 'newOrderReceived':
        result = await sendNewOrderNotificationToAdmin(testOrderData);
        break;
      case 'orderCancelled':
        result = await sendOrderCancelledNotificationToAdmin(testOrderData);
        break;
      default:
        res.status(400);
        throw new Error(`Invalid template name. Available: orderOutForDelivery, orderDelivered, orderCancelledByAdmin, newOrderReceived, orderCancelled`);
    }
    
    console.log('🧪 Test email result:', result);
    
    res.json({
      success: result.success,
      message: result.success ? 
        `Test email '${templateName}' sent successfully` : 
        `Failed to send test email '${templateName}'`,
      method: result.method,
      details: result
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({
      success: false,
      message: "Test email failed",
      error: error.message
    });
  }
});

export {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  searchOrders,
  getOrderStats,
  testEmail
};