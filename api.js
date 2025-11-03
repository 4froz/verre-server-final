import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./functions/config/db.js";
import userRoutes from "./functions/routes/userRoutes.js";
import productRoute from "./functions/routes/productRoute.js";
import orderRoute from "./functions/routes/orderRoute.js";
import paymentRoute from "./functions/routes/paymentRoutes.js";
import cartRoutes from "./functions/routes/cartRoutes.js";
import { notFound, errorHandler } from "./functions/middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 🔒 SECURE CORS Configuration - allow only the production frontend
const allowedOrigin = 'https://verre-nu.vercel.app';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400 // 24 hours
}));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Connect to database (await to avoid queries before initial connection)
try {
  await connectDb();
} catch (err) {
  console.error('Database connection error:', err.message);
  // Don't exit in serverless - let Vercel handle it
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    process.exit(1);
  }
}

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Verre API is Running",
    version: "1.0.0",
    // Only expose environment in development
    ...(process.env.NODE_ENV !== 'production' && { environment: process.env.NODE_ENV || 'development' })
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/cart", cartRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Export the Express app for Vercel serverless functions
export default app;

// Start server only in development/local environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 7000;
  const HOST = process.env.HOST || 'localhost';

  app.listen(PORT, () => {
    console.log(`🚀 Verre Server is running on ${HOST}:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 CORS Origins: ${allowedOrigin}`);
  });
}