import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import Product from "../models/productModel.js";
import { getRazorpayConfig, PAYMENT_CONFIG } from "../config/paymentConfig.js";

// Initialize Razorpay with environment-specific config
let razorpay;

try {
  // Validate configuration on startup
  PAYMENT_CONFIG.validateConfig();
  const config = getRazorpayConfig();
  
  razorpay = new Razorpay({
    key_id: config.key_id,
    key_secret: config.key_secret,
  });
  
  console.log(`🔧 Razorpay initialized for ${PAYMENT_CONFIG.getEnvironmentName()} environment`);
} catch (error) {
  console.error("❌ Failed to initialize Razorpay:", error.message);
  process.exit(1); // Exit if payment config is invalid
}

// Get Razorpay configuration
const getPaymentConfig = asyncHandler(async (req, res) => {
  try {
    const config = getRazorpayConfig();
    
    res.json({
      key_id: config.key_id,
      environment: PAYMENT_CONFIG.getEnvironmentName(),
      isProduction: PAYMENT_CONFIG.isProduction
    });
  } catch (error) {
    console.error("Payment config error:", error);
    res.status(500).json({
      success: false,
      message: "Payment configuration error"
    });
  }
});

// 🔒 SECURITY: Create Razorpay order with server-validated amount
const createPaymentOrder = asyncHandler(async (req, res) => {
  try {
    const { items, deliveryMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    // 🔒 SECURITY: Validate and calculate total server-side
    let calculatedSubtotal = 0;

    for (const item of items) {
      const { productId, qty } = item;

      if (!productId || !qty || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product data"
        });
      }

      // Fetch current product price from database
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Product out of stock: ${product.name}`
        });
      }

      // Use server's authoritative price
      const serverPrice = product.price;
      calculatedSubtotal += serverPrice * qty;
    }

    // Calculate delivery price server-side
    const deliveryPrice = deliveryMethod === "express" ? 140 : 70;
    const totalAmount = calculatedSubtotal + deliveryPrice;

    // Convert to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        subtotal: calculatedSubtotal,
        deliveryPrice,
        deliveryMethod,
        userId: req.user._id.toString()
      }
    });

    res.json({
      success: true,
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      calculatedTotal: totalAmount
    });

  } catch (error) {
    console.error("Payment order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order"
    });
  }
});

// Verify payment signature (optional but recommended)
const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data"
      });
    }

    const config = getRazorpayConfig();
    const crypto = await import('crypto');
    
    // Create signature hash
    const shasum = crypto.createHmac('sha256', config.key_secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      console.log(`✅ Payment verified successfully: ${razorpay_payment_id}`);
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id
      });
    } else {
      console.log(`❌ Payment verification failed: ${razorpay_payment_id}`);
      res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
});

// Webhook handler for Razorpay events (optional but recommended for production)
const handleWebhook = asyncHandler(async (req, res) => {
  try {
    const webhookSignature = req.get('X-Razorpay-Signature');
    const webhookBody = JSON.stringify(req.body);
    
    if (!webhookSignature) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook signature"
      });
    }

    const config = getRazorpayConfig();
    const crypto = await import('crypto');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', config.webhook_secret)
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature === expectedSignature) {
      const event = req.body;
      
      // Handle different webhook events
      switch (event.event) {
        case 'payment.captured':
          console.log(`💰 Payment captured: ${event.payload.payment.entity.id}`);
          // Update order status in database
          break;
        case 'payment.failed':
          console.log(`❌ Payment failed: ${event.payload.payment.entity.id}`);
          // Handle failed payment
          break;
        default:
          console.log(`📨 Unhandled webhook event: ${event.event}`);
      }
      
      res.json({ success: true });
    } else {
      console.log("❌ Invalid webhook signature");
      res.status(400).json({
        success: false,
        message: "Invalid webhook signature"
      });
    }
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed"
    });
  }
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  try {
    const { payment_id } = req.params;

    if (!payment_id) {
      res.status(400);
      throw new Error("Payment ID is required");
    }

    console.log(`🔍 Checking payment status for: ${payment_id}`);

    const payment = await razorpay.payments.fetch(payment_id);
    
    if (!payment) {
      res.status(404);
      throw new Error("Payment not found");
    }

    console.log(`✅ Payment status retrieved: ${payment.status}`);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        created_at: payment.created_at,
        order_id: payment.order_id
      }
    });

  } catch (error) {
    console.error('❌ Payment status check failed:', error);
    
    if (error.error && error.error.description) {
      res.status(400);
      throw new Error(`Payment status check failed: ${error.error.description}`);
    }
    
    res.status(500);
    throw new Error("Failed to get payment status");
  }
});

// Refund payment
const refundPayment = asyncHandler(async (req, res) => {
  try {
    const { payment_id, amount, reason = 'Customer request' } = req.body;

    if (!payment_id) {
      res.status(400);
      throw new Error("Payment ID is required");
    }

    if (amount && amount <= 0) {
      res.status(400);
      throw new Error("Refund amount must be positive");
    }

    console.log(`🔄 Processing refund for payment: ${payment_id}`);

    const refundOptions = {
      payment_id,
      ...(amount && { amount: Math.round(amount * 100) }), // Convert to paise
      speed: 'normal', // or 'optimum'
      notes: {
        reason,
        environment: isProduction() ? 'production' : 'development',
        timestamp: new Date().toISOString()
      }
    };

    const refund = await razorpay.payments.refund(refundOptions);
    
    console.log(`✅ Refund processed successfully: ${refund.id}`);

    res.json({
      success: true,
      refund: {
        id: refund.id,
        payment_id: refund.payment_id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        created_at: refund.created_at
      }
    });

  } catch (error) {
    console.error('❌ Refund processing failed:', error);
    
    if (error.error && error.error.description) {
      res.status(400);
      throw new Error(`Refund failed: ${error.error.description}`);
    }
    
    res.status(500);
    throw new Error("Failed to process refund");
  }
});

const verifyPaymentSignature = asyncHandler(async (req, res) => {
  try {
    const config = getRazorpayConfig();
    const secret = config.webhook_secret;

    if (!secret) {
      console.error('❌ Webhook secret not configured');
      res.status(500);
      throw new Error("Webhook verification not configured");
    }

    // Get the signature from headers
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      res.status(400);
      throw new Error("Razorpay signature header missing");
    }

    // Create HMAC SHA256 hash
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(`🔐 Payment verification:`, {
      received: signature,
      calculated: digest,
      match: digest === signature,
      environment: isProduction() ? 'production' : 'development'
    });

    // Verify signature
    if (digest === signature) {
      console.log("✅ Payment signature verified successfully");
      
      // Process the payment data
      const paymentData = req.body;
      
      // Log payment details (in production, you might want to store this in database)
      if (isDevelopment()) {
        require("fs").writeFileSync(
          `payment_${Date.now()}.json`,
          JSON.stringify(paymentData, null, 2)
        );
      }

      // Extract important payment information
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        payload: { order: { receipt } } = {}
      } = paymentData;

      // Here you would typically:
      // 1. Update order status in database
      // 2. Send confirmation emails
      // 3. Update inventory
      // 4. Log payment success

      console.log(`💰 Payment successful:`, {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        receipt,
        amount: paymentData.payload?.payment?.entity?.amount,
        currency: paymentData.payload?.payment?.entity?.currency
      });

      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      console.error("❌ Payment signature verification failed");
      res.status(400);
      throw new Error("Invalid payment signature");
    }

  } catch (error) {
    console.error('❌ Payment verification failed:', error.message);
    res.status(400);
    throw new Error(`Payment verification failed: ${error.message}`);
  }
});

export { getPaymentConfig, createPaymentOrder, verifyPayment, handleWebhook, getPaymentStatus,refundPayment,verifyPaymentSignature};