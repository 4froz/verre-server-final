import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();
// Initialize Resend for admin emails only
let resend = new Resend(process.env.RESEND_API_KEY);

// Check if domain is verified for direct customer emails
const isDomainVerified = process.env.RESEND_DOMAIN_VERIFIED === 'true';
const adminEmail = process.env.ADMIN_EMAIL;

console.log('📧 Email Service Config:', {
  domainVerified: isDomainVerified,
  adminEmail: adminEmail
});

// Email templates for different notifications
const emailTemplates = {
  // Customer notifications
  orderOutForDelivery: (orderData) => {
    const orderId = orderData.orderId || 'N/A';
    const customerName = orderData.user?.name || 'Customer';
    const totalPrice = orderData.totalPrice || 0;
    const itemsCount = orderData.orderItems?.length || 0;
    const trackingId = orderData.trackingId || null;

    return {
      subject: `🚚 Your Order #${orderId} is Out for Delivery!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Order is On Its Way! 🚚</h2>
          <p>Hi ${customerName},</p>
          <p>Great news! Your order <strong>#${orderId}</strong> is now out for delivery.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString()}</p>
            <p><strong>Items:</strong> ${itemsCount} item(s)</p>
            ${trackingId ? `<p><strong>Tracking ID:</strong> ${trackingId}</p>` : ''}
          </div>
          
          <p>Your order should arrive soon! Please ensure someone is available to receive the delivery.</p>
          <p>Thank you for choosing us!</p>
        </div>
      `
    };
  },

  orderDelivered: (orderData) => {
    const orderId = orderData.orderId || 'N/A';
    const customerName = orderData.user?.name || 'Customer';
    const totalPrice = orderData.totalPrice || 0;
    const itemsCount = orderData.orderItems?.length || 0;
    const deliveredDate = orderData.deliveredAt 
      ? new Date(orderData.deliveredAt).toLocaleDateString() 
      : new Date().toLocaleDateString();

    return {
      subject: `✅ Your Order #${orderId} has been Delivered!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Order Delivered! ✅</h2>
          <p>Hi ${customerName},</p>
          <p>Your order <strong>#${orderId}</strong> has been successfully delivered!</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString()}</p>
            <p><strong>Items:</strong> ${itemsCount} item(s)</p>
            <p><strong>Delivered On:</strong> ${deliveredDate}</p>
          </div>
          
          <p>We hope you love your purchase! If you have any questions or need support, please don't hesitate to contact us.</p>
          <p>Thank you for shopping with us!</p>
        </div>
      `
    };
  },

  orderCancelledByAdmin: (orderData) => {
    const orderId = orderData.orderId || 'N/A';
    const customerName = orderData.user?.name || 'Customer';
    const totalPrice = orderData.totalPrice || 0;
    const cancelledDate = orderData.cancelledAt 
      ? new Date(orderData.cancelledAt).toLocaleDateString() 
      : new Date().toLocaleDateString();
    const cancelReason = orderData.cancelReason || 'Not specified';

    return {
      subject: `❌ Your Order #${orderId} has been Cancelled`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Order Cancelled ❌</h2>
          <p>Hi ${customerName},</p>
          <p>We regret to inform you that your order <strong>#${orderId}</strong> has been cancelled by our team.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString()}</p>
            <p><strong>Cancelled On:</strong> ${cancelledDate}</p>
            <p><strong>Reason:</strong> ${cancelReason}</p>
          </div>
          
          <p>If you have already made a payment, it will be refunded to your original payment method within 5-7 business days.</p>
          <p>We apologize for any inconvenience caused. Please contact our support team if you have any questions.</p>
        </div>
      `
    };
  },

  // Admin notifications
  newOrderReceived: (orderData) => {
    const orderId = orderData.orderId || 'N/A';
    const customerName = orderData.user?.name || 'Unknown Customer';
    const customerEmail = orderData.user?.email || 'Unknown Email';
    const totalPrice = orderData.totalPrice || 0;
    const itemsCount = orderData.orderItems?.length || 0;
    const paymentMethod = orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment';
    const deliveryMethod = orderData.deliveryMethod === 'express' ? 'Express Delivery' : 'Regular Delivery';
    const orderDate = orderData.createdAt 
      ? new Date(orderData.createdAt).toLocaleDateString() 
      : new Date().toLocaleDateString();

    return {
      subject: `🆕 New Order Received - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">New Order Alert! 🆕</h2>
          <p>A new order has been placed on your store.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString()}</p>
            <p><strong>Items:</strong> ${itemsCount} item(s)</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Delivery Method:</strong> ${deliveryMethod}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
          </div>
          
          ${orderData.shippingAddress ? `
          <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #0066cc;">Shipping Address:</h4>
            <p>${orderData.shippingAddress.address || ''}<br>
            ${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.state || ''}<br>
            ${orderData.shippingAddress.zipCode || ''}</p>
          </div>
          ` : ''}
          
          ${orderData.orderItems?.length ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #856404;">Order Items:</h4>
            ${orderData.orderItems.map(item => 
              `<p>• ${item.name || 'Unknown Item'} - Qty: ${item.qty || 0} - ₹${(item.price || 0).toLocaleString()}</p>`
            ).join('')}
          </div>
          ` : ''}
          
          <p>Please process this order as soon as possible.</p>
        </div>
      `
    };
  },

  orderCancelled: (orderData) => {
    const orderId = orderData.orderId || 'N/A';
    const customerName = orderData.user?.name || 'Unknown Customer';
    const customerEmail = orderData.user?.email || 'Unknown Email';
    const totalPrice = orderData.totalPrice || 0;
    const cancelledDate = orderData.cancelledAt 
      ? new Date(orderData.cancelledAt).toLocaleDateString() 
      : new Date().toLocaleDateString();
    const cancelReason = orderData.cancelReason || 'Not specified';

    return {
      subject: `❌ Order Cancelled - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Order Cancelled ❌</h2>
          <p>An order has been cancelled on your store.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Total Amount:</strong> ₹${totalPrice.toLocaleString()}</p>
            <p><strong>Cancelled On:</strong> ${cancelledDate}</p>
            <p><strong>Reason:</strong> ${cancelReason}</p>
          </div>
          
          <p>Please update your inventory and records accordingly.</p>
        </div>
      `
    };
  },

  // Forward template for customer emails sent to admin
  customerEmailForward: (originalTemplate, orderData, customerEmail) => {
    const orderId = orderData.orderId || 'N/A';
    const customerName = orderData.user?.name || 'Unknown Customer';

    return {
      subject: `[FORWARD TO CUSTOMER] ${originalTemplate.subject}`,
      html: `
        <div style="background: #fff3cd; padding: 20px; margin-bottom: 30px; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3 style="margin: 0 0 15px 0; color: #856404;">📧 Customer Email - Please Forward Manually</h3>
          <p><strong>📧 Forward this email to:</strong> <a href="mailto:${customerEmail}" style="color: #0066cc; font-weight: bold;">${customerEmail}</a></p>
          <p><strong>👤 Customer Name:</strong> ${customerName}</p>
          <p><strong>🛍️ Order ID:</strong> #${orderId}</p>
          <p><strong>⚠️ Reason:</strong> Domain not verified for direct customer emails</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <strong>Instructions:</strong>
            <ol style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Copy the email content below</li>
              <li>Create a new email to <strong>${customerEmail}</strong></li>
              <li>Use subject: <strong>${originalTemplate.subject}</strong></li>
              <li>Paste the content and send</li>
            </ol>
          </div>
        </div>
        
        <div style="border: 2px solid #007bff; border-radius: 8px; padding: 20px;">
          <h4 style="margin: 0 0 20px 0; color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            📝 EMAIL CONTENT TO FORWARD:
          </h4>
          ${originalTemplate.html}
        </div>
      `
    };
  }
};

// Core email sending function
const sendEmail = async (to, templateName, orderData, isAdminEmail = false) => {
  try {
    console.log(`📧 Attempting to send email: ${templateName} to ${to}`);
    
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    
    const emailContent = template(orderData);
    
    // Always send admin emails via Resend
    if (isAdminEmail || to === adminEmail) {
      console.log(`📧 Sending admin email via Resend to: ${to}`);
      
      if (!resend) {
        console.log('❌ Resend not configured');
        return { success: false, error: 'Resend not configured' };
      }
      
      const { data, error } = await resend.emails.send({
        from: 'Verre Store <onboarding@resend.dev>',
        to: [to],
        ...emailContent
      });

      if (error) {
        console.error('❌ Resend error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Admin email sent via Resend:', data);
      return { success: true, data };
    } 
    
    // Handle customer emails based on domain verification
    else {
      const customerEmail = to;
      
      // If domain is verified, send directly to customer
      if (isDomainVerified) {
        console.log(`📧 Domain verified - sending customer email directly to: ${customerEmail}`);
        
        const { data, error } = await resend.emails.send({
          from: 'Verre Store <onboarding@resend.dev>',
          to: [customerEmail],
          ...emailContent
        });

        if (error) {
          console.error('❌ Direct customer email error:', error);
          return { success: false, error: error.message };
        }

        console.log('✅ Direct customer email sent:', data);
        return { success: true, data, method: 'direct' };
      } 
      
      // If domain not verified, send to admin with forward instructions
      else {
        console.log('📧 Domain not verified - sending customer email to admin for forwarding');
        
        const forwardTemplate = emailTemplates.customerEmailForward(emailContent, orderData, customerEmail);
        
        const { data, error } = await resend.emails.send({
          from: 'Verre Store <onboarding@resend.dev>',
          to: [adminEmail],
          ...forwardTemplate
        });

        if (error) {
          console.error('❌ Forward to admin email error:', error);
          return { success: false, error: error.message };
        }

        console.log('✅ Customer email forwarded to admin for manual sending');
        return { 
          success: true, 
          data, 
          method: 'forwarded',
          message: 'Email sent to admin for manual forwarding to customer'
        };
      }
    }
    
  } catch (error) {
    console.error('❌ Email service error:', error);
    return { success: false, error: error.message };
  }
};

// Customer notification functions
export const sendOrderOutForDeliveryEmail = (orderData) => {
  console.log('🔍 Sending out for delivery email to customer:', orderData.user?.email);
  if (!orderData.user?.email) {
    console.error('❌ No customer email found in order data');
    return Promise.resolve({ success: false, error: 'No customer email found' });
  }
  return sendEmail(orderData.user.email, 'orderOutForDelivery', orderData);
};

export const sendOrderDeliveredEmail = (orderData) => {
  console.log('🔍 Sending delivered email to customer:', orderData.user?.email);
  if (!orderData.user?.email) {
    console.error('❌ No customer email found in order data');
    return Promise.resolve({ success: false, error: 'No customer email found' });
  }
  return sendEmail(orderData.user.email, 'orderDelivered', orderData);
};

export const sendOrderCancelledByAdminEmail = (orderData) => {
  console.log('🔍 Sending cancelled by admin email to customer:', orderData.user?.email);
  if (!orderData.user?.email) {
    console.error('❌ No customer email found in order data');
    return Promise.resolve({ success: false, error: 'No customer email found' });
  }
  return sendEmail(orderData.user.email, 'orderCancelledByAdmin', orderData);
};

// Admin notification functions
export const sendNewOrderNotificationToAdmin = (orderData) => {
  console.log('🔍 Sending new order notification to admin');
  return sendEmail(adminEmail, 'newOrderReceived', orderData, true);
};

export const sendOrderCancelledNotificationToAdmin = (orderData) => {
  console.log('🔍 Sending cancellation notification to admin');
  return sendEmail(adminEmail, 'orderCancelled', orderData, true);
};

// Test function
export const testEmailSending = async (testEmail) => {
  console.log('🧪 Testing email sending to:', testEmail);
  
  const testData = {
    orderId: 'TEST123',
    user: {
      name: 'Test User',
      email: testEmail
    },
    totalPrice: 1000,
    orderItems: [
      { 
        name: 'Test Item', 
        qty: 1, 
        price: 1000 
      }
    ],
    shippingAddress: {
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    },
    paymentMethod: 'cod',
    deliveryMethod: 'regular',
    createdAt: new Date()
  };
  
  return await sendEmail(testEmail, 'orderOutForDelivery', testData);
};