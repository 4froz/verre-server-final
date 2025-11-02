# Email Notifications Setup Guide

## Overview
This application uses **Resend** for sending email notifications for order status updates.

## Email Notifications Implemented

### Customer Notifications:
- 🚚 **Out for Delivery**: When order status changes to "out for delivery"
- ✅ **Delivered**: When order status changes to "delivered"  
- ❌ **Cancelled by Admin**: When admin cancels an order

### Admin Notifications:
- 🆕 **New Order**: When a new order is placed
- ❌ **Order Cancelled**: When any order is cancelled (by customer or admin)

## Setup Instructions

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. **Free Tier**: 3,000 emails/month

### 2. Configure Environment Variables
Add to your `.env` file:
```env
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=devarc404@gmail.com
```

### 3. Verify Your Domain (Optional but Recommended)
For better deliverability:
1. Add your domain in Resend dashboard
2. Update the `from` email in `emailService.js`:
   ```javascript
   from: 'Verre Store <noreply@yourdomain.com>'
   ```

### 4. Test Email Notifications
The emails will be sent automatically when:
- New orders are created
- Order status is updated to "out for delivery"
- Order status is updated to "delivered"
- Orders are cancelled by admin
- Any order is cancelled (admin notification)

## Email Templates
All email templates are HTML-formatted and include:
- Order details (ID, items, total)
- Customer information
- Status-specific messaging
- Professional styling

## Troubleshooting
- Check console logs for email errors
- Verify RESEND_API_KEY is set correctly
- Ensure admin email is correct
- Check Resend dashboard for delivery status

## Alternative Email Services
If you prefer other services:
- **SendGrid**: 100 emails/day free
- **Mailgun**: 5,000 emails/month for 3 months
- **Brevo**: 300 emails/day free

Just replace the Resend implementation in `emailService.js`.










