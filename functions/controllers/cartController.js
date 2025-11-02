import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// 🔒 SECURITY: Validate cart items with server-side prices
const validateCart = asyncHandler(async (req, res) => {
  try {
    const { items } = req.body;
    console.log(items);
    

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required"
      });
    }

    // Validate each item against database
    const validatedItems = [];
    
    for (const item of items) {
      const { productId, qty, variant = "default" } = item;

      if (!productId || !qty || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID or quantity"
        });
      }

      // Fetch current product data from database
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
      const currentPrice = product.price;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        img: product.img[0], // First image
        currentPrice, // Server-validated price
        qty: Number(qty),
        variant,
        inStock: product.inStock
      });
    }

    // Calculate server-side totals
    const subtotal = validatedItems.reduce((sum, item) => sum + (item.currentPrice * item.qty), 0);

    res.json({
      success: true,
      validatedItems,
      subtotal,
      message: "Cart validated successfully"
    });

  } catch (error) {
    console.error("Cart validation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during cart validation"
    });
  }
});

export { validateCart };