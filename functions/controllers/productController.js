import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// Get paginated products
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const sort = req.query.sort || "default";
  const allProducts = req.query.allProducts === "true"; // ensure boolean

  const query = {};

  // Sort options
  let sortOptions = {};
  switch (sort) {
    case "price-asc":
      sortOptions = { price: 1 };
      break;
    case "price-desc":
      sortOptions = { price: -1 };
      break;
    case "name-asc":
      sortOptions = { name: 1 };
      break;
    case "name-desc":
      sortOptions = { name: -1 };
      break;
    case "bestseller":
      query.bestSellers = true;
      break;
    default:
      sortOptions = {};
  }

  // 👉 return all products if requested
  if (allProducts) {
    const all = await Product.find(query);
    return res.json({ products: all, total: all.length });
  }

  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(totalProducts / limit),
    total: totalProducts,
  });
});

// Admin get products
const adminGetProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;

  const totalProducts = await Product.countDocuments();

  const products = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(totalProducts / limit),
    total: totalProducts,
  });
});

// Get product by slug/id (frontend use)
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const matchedProduct = await Product.findOne({
    name: { $regex: new RegExp("^" + id.replace(/-/g, "\\s"), "i") },
  });

  if (matchedProduct) {
    res.json(matchedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Get product by ObjectId (admin use)
const getProductByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error.message);
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// Create product
const createProduct = asyncHandler(async (req, res) => {
  const { name, desc, img, price, discountPrice, bestSellers, inStock } = req.body;

  if (!name || !img || !Array.isArray(img) || img.length === 0 || !price) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const product = new Product({
    name,
    desc,
    img,
    price,
    discountPrice,
    bestSellers,
    inStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, desc, img, price, discountPrice, bestSellers, inStock } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name || product.name;
  product.desc = desc || product.desc;
  product.img = img || product.img;
  product.price = price ?? product.price;
  product.discountPrice = discountPrice ?? product.discountPrice;
  product.bestSellers = bestSellers ?? product.bestSellers;
  product.inStock = inStock ?? product.inStock;

  const updatedProduct = await product.save();

  res.json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  adminGetProducts,
  getProductByIdAdmin,
};
