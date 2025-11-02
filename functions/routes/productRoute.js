import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adminGetProducts,
  getProductByIdAdmin,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (No authentication required)
// ==========================================

// Get all products with pagination, sorting, filtering
router.route("/").get(getProducts);

// Get product count (public for stats) - BEFORE /:id
router.route("/admin/count").get(asyncHandler(async (req, res) => {
  try {
    const total = await Product.countDocuments({});
    res.json({ total });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product count" });
  }
}));

// Search products by name - BEFORE /:id
router.route("/search").post(asyncHandler(async (req, res) => {
  try {
    const { query } = req.body;

    // Ensure there's a query string to search for
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive partial search for product names
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // 'i' makes it case-insensitive
    });

    // Map results to return only necessary fields
    const searchResults = products.map((product) => ({
      name: product.name,
      img: product.img, // Fixed: using 'img' from model instead of 'image'
      bestSellers: product.bestSellers,
      price: product.price,
      discountPrice: product.discountPrice,
      inStock: product.inStock,
      _id: product._id,
    }));

    return res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching for products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}));

// ==========================================
// ADMIN ROUTES (Authentication + Admin required) - BEFORE /:id
// ==========================================

// Get all products for admin (with different pagination/data)
router.route("/admin").get(protect, admin, adminGetProducts);

// Create new product (admin only)
router.route("/admin").post(protect, admin, createProduct);

// Admin product management by ID
router
  .route("/admin/:id")
  .get(protect, admin, getProductByIdAdmin) // Get product by ObjectId for editing
  .put(protect, admin, updateProduct) // Update product
  .delete(protect, admin, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      // Attempt to delete the product with the provided ID
      const deletedProduct = await Product.findByIdAndDelete(id);

      // Check if product was found and deleted
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Respond with success message
      res.status(200).json({ 
        message: "Product deleted successfully",
        deletedProduct: {
          id: deletedProduct._id,
          name: deletedProduct.name
        }
      });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ 
        message: "Server error, unable to delete product" 
      });
    }
  }));

// ==========================================
// DYNAMIC ROUTES - MUST BE LAST!
// ==========================================

// Get single product by slug/name (for frontend product detail page) - MUST BE LAST
router.route("/:id").get(getProductById);

// ==========================================
// FUTURE ROUTES (Commented for later implementation)
// ==========================================

// router.get("/accessories", getAccessories);
// router.get("/random", getRandomProducts);
// router.get("/search", getSearchProducts);

export default router;