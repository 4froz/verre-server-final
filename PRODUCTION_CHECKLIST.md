# Production Readiness Checklist

## ✅ Code Fixes (Completed)
- [x] Express app exported as serverless function for Vercel
- [x] Database connection optimized for serverless (connection reuse)
- [x] Error handling doesn't expose stack traces in production
- [x] Environment variable hidden in root endpoint response
- [x] Database connection error handling for serverless

## ⚠️ Required: Environment Variables in Vercel Dashboard

You MUST configure these environment variables in your Vercel project settings:

### Critical (Required)
- `MONGO_URI` - Your MongoDB connection string
- `NODE_ENV=production`
- `FRONTEND_URL` - Your production frontend URL (e.g., `https://yourdomain.com`)
- `ADMIN_URL` - Your admin panel URL

### Firebase (Required if using Firebase auth)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` - Make sure to include `\n` characters correctly

### Payment (Required if using Razorpay)
**For Production:**
- `RAZORPAY_LIVE_KEY_ID` - Use LIVE keys, not test keys!
- `RAZORPAY_LIVE_KEY_SECRET` - Use LIVE keys, not test keys!
- `RAZORPAY_LIVE_WEBHOOK_SECRET` - Production webhook secret

**For Testing (Optional):**
- `RAZORPAY_TEST_KEY_ID`
- `RAZORPAY_TEST_KEY_SECRET`
- `RAZORPAY_TEST_WEBHOOK_SECRET`

### Email (Required if using email)
- `RESEND_API_KEY`
- `ADMIN_EMAIL` - Admin email address
- `RESEND_DOMAIN_VERIFIED` - Set to `true` if domain is verified

### Security
- `JWT_SECRET` - Generate a strong random secret (at least 32 characters)

### Optional (Rate Limiting)
- `RATE_LIMIT_WINDOW_MS` - Default: 900000 (15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Default: 100

## 📝 How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with:
   - **Key**: Variable name (e.g., `MONGO_URI`)
   - **Value**: Variable value
   - **Environment**: Select `Production` (and optionally `Preview` and `Development`)
4. Click **Save**
5. **Redeploy** your application for changes to take effect

## 🔒 Security Checklist

- [x] Error messages don't leak sensitive info in production
- [x] CORS is properly configured
- [x] Rate limiting is implemented
- [x] Security headers are set
- [ ] All secrets are in environment variables (not hardcoded)
- [ ] Production payment keys are set (not test keys)
- [ ] JWT_SECRET is strong and random
- [ ] MongoDB connection string doesn't expose credentials in logs

## 🚀 Deployment Checklist

- [x] Code is pushed to Git
- [x] Vercel deployment is successful
- [ ] All environment variables are set in Vercel
- [ ] Database is accessible from Vercel
- [ ] Firebase credentials are configured
- [ ] Payment gateway is configured with LIVE keys
- [ ] Email service is configured
- [ ] CORS URLs are set to production domains
- [ ] Test the API endpoints after deployment

## 🧪 Post-Deployment Testing

After deploying, test these endpoints:

1. **Root endpoint**: `GET /` - Should return API info
2. **Health check**: `GET /health` - Should return healthy status
3. **API endpoints**: Test your main API routes
4. **Authentication**: Test protected routes
5. **Payment**: Test payment flow (use test mode first!)
6. **CORS**: Verify frontend can access the API

## 📊 Monitoring

- Monitor Vercel logs for errors
- Check database connection performance
- Monitor API response times
- Set up error tracking (optional but recommended)

## 🔄 Updates

After setting environment variables, redeploy:
```bash
vercel --prod
```

Or redeploy from Vercel dashboard after saving environment variables.


