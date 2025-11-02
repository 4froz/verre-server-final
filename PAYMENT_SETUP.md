# 🚀 Production-Ready Razorpay Payment Setup Guide

## 📋 Overview
This guide will help you set up a production-ready Razorpay payment system for your Verre Store application with proper backend verification and environment-based configuration.

## 🔧 What's Been Implemented

### ✅ **Backend Features:**
- Environment-based configuration (dev/prod)
- Proper payment signature verification
- Payment status checking
- Refund processing
- Comprehensive error handling
- Security middleware
- Webhook handling

### ✅ **Frontend Features:**
- Dynamic payment key loading
- Better error handling
- Loading states
- Payment success tracking

## 🚀 Quick Setup

### 1. **Environment Configuration**
Copy `env.example` to `.env` and configure:

```bash
# Development (current)
NODE_ENV=development

# Production (when ready)
NODE_ENV=production
```

### 2. **Razorpay Keys Setup**

#### **Development (Current - Free)**
```env
RAZORPAY_TEST_KEY_ID=rzp_test_fF62bDmx4cqklg
RAZORPAY_TEST_KEY_SECRET=WffXVbsaZFNln6vHFnk4YGqq
RAZORPAY_TEST_WEBHOOK_SECRET=12345678
```

#### **Production (Paid - When Ready)**
```env
RAZORPAY_LIVE_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_LIVE_KEY_SECRET=your_live_key_secret
RAZORPAY_LIVE_WEBHOOK_SECRET=your_live_webhook_secret
```

## 🔐 Production Setup Steps

### **Step 1: Get Production Keys**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Switch to **Live Mode**
3. Go to **Settings** → **API Keys**
4. Generate new **Live API Keys**
5. Copy `Key ID` and `Key Secret`

### **Step 2: Configure Webhooks**
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the **Webhook Secret**

### **Step 3: Update Environment**
```env
NODE_ENV=production
RAZORPAY_LIVE_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_LIVE_KEY_SECRET=your_live_key_secret
RAZORPAY_LIVE_WEBHOOK_SECRET=your_live_webhook_secret
```

### **Step 4: Update Frontend URLs**
```env
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

## 🧪 Testing

### **Development Testing**
```bash
# Test payment creation
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000}'

# Test payment verification
curl -X POST http://localhost:5000/api/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **Production Testing**
1. Use Razorpay's **Test Mode** first
2. Test with small amounts (₹1)
3. Verify webhook delivery
4. Check payment status updates

## 🔒 Security Features

### **Payment Verification**
- ✅ HMAC SHA256 signature verification
- ✅ Webhook secret validation
- ✅ Environment-based key management
- ✅ Input validation and sanitization

### **API Protection**
- ✅ Authentication middleware
- ✅ Admin-only refund access
- ✅ CORS configuration
- ✅ Rate limiting (can be added)

## 📊 Payment Flow

```
1. Frontend → Backend: Create payment order
2. Backend → Razorpay: Create order
3. Frontend → Razorpay: Payment form
4. Razorpay → Backend: Webhook (payment success/failure)
5. Backend: Verify signature & update order
6. Backend → Frontend: Order confirmation
```

## 🚨 Error Handling

### **Common Issues & Solutions**

#### **Payment Order Creation Failed**
```javascript
// Check if Razorpay is initialized
console.log('Razorpay config:', getRazorpayConfig());

// Verify environment variables
console.log('NODE_ENV:', process.env.NODE_ENV);
```

#### **Webhook Verification Failed**
```javascript
// Check webhook secret
console.log('Webhook secret:', config.webhook_secret);

// Verify signature header
console.log('Signature header:', req.headers["x-razorpay-signature"]);
```

#### **Frontend Payment Failed**
```javascript
// Check payment configuration
const config = await axios.get('/api/payment/config');
console.log('Payment config:', config.data);

// Verify Razorpay SDK loading
console.log('Razorpay loaded:', window.Razorpay);
```

## 📈 Monitoring & Logging

### **Payment Logs**
- ✅ Order creation logs
- ✅ Payment verification logs
- ✅ Error logs with context
- ✅ Environment information

### **Success Metrics**
- ✅ Payment success rate
- ✅ Average transaction value
- ✅ Failed payment reasons
- ✅ Webhook delivery status

## 🔄 Refund Processing

### **Admin Refund Access**
```bash
# Only admins can process refunds
POST /api/payment/refund
Authorization: Bearer ADMIN_TOKEN
{
  "payment_id": "pay_xxx",
  "amount": 1000,
  "reason": "Customer request"
}
```

## 🚀 Deployment Checklist

### **Before Going Live:**
- [ ] Set `NODE_ENV=production`
- [ ] Configure production Razorpay keys
- [ ] Set production webhook URLs
- [ ] Test webhook delivery
- [ ] Verify payment flow end-to-end
- [ ] Set up monitoring and alerts

### **Environment Variables:**
```env
NODE_ENV=production
RAZORPAY_LIVE_KEY_ID=rzp_live_xxx
RAZORPAY_LIVE_KEY_SECRET=xxx
RAZORPAY_LIVE_WEBHOOK_SECRET=xxx
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

## 🆘 Support

### **Razorpay Support**
- 📧 [support@razorpay.com](mailto:support@razorpay.com)
- 📞 [Razorpay Support](https://razorpay.com/support/)
- 📚 [Documentation](https://razorpay.com/docs/)

### **Common Error Codes**
- `BAD_REQUEST_ERROR`: Invalid input parameters
- `AUTHENTICATION_ERROR`: Invalid API keys
- `SIGNATURE_VERIFICATION_FAILED`: Webhook verification failed
- `ORDER_NOT_FOUND`: Order ID doesn't exist

## 🎯 Next Steps

1. **Test the current setup** with development keys
2. **Get production Razorpay account** when ready
3. **Configure webhooks** for production
4. **Deploy with production environment**
5. **Monitor payment success rates**

---

**🎉 Your payment system is now production-ready!** 

The system automatically switches between development and production configurations based on `NODE_ENV`, ensuring security and proper verification in both environments.










