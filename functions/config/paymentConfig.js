import dotenv from 'dotenv';
dotenv.config();

// Payment configuration based on environment
export const PAYMENT_CONFIG = {
  // Razorpay configuration
  razorpay: {
      // Test keys (development)
  test: {
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
    webhook_secret: process.env.RAZORPAY_TEST_WEBHOOK_SECRET
  },
    // Production keys
    production: {
      key_id: process.env.RAZORPAY_LIVE_KEY_ID,
      key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
      webhook_secret: process.env.RAZORPAY_LIVE_WEBHOOK_SECRET
    }
  },
  
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
  
  // Get current environment config
  getCurrentConfig() {
    if (this.isProduction) {
      if (!this.razorpay.production.key_id || !this.razorpay.production.key_secret) {
        throw new Error('Production Razorpay keys not configured. Set RAZORPAY_LIVE_KEY_ID and RAZORPAY_LIVE_KEY_SECRET');
      }
      return this.razorpay.production;
    } else {
      return this.razorpay.test;
    }
  },
  
  // Get current environment name
  getEnvironmentName() {
    return this.isProduction ? 'production' : 'development';
  },
  
  // Validate configuration
  validateConfig() {
    const config = this.getCurrentConfig();
    if (!config.key_id || !config.key_secret) {
      throw new Error(`Razorpay ${this.getEnvironmentName()} keys not configured`);
    }
    return true;
  }
};

// Export individual configs for convenience
export const getRazorpayConfig = () => PAYMENT_CONFIG.getCurrentConfig();
export const isProduction = () => PAYMENT_CONFIG.isProduction;
export const isDevelopment = () => PAYMENT_CONFIG.isDevelopment;



