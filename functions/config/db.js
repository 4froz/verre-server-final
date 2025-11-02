import mongoose from "mongoose";
import Product from "../models/productModel.js";
import fs from "fs";
import csv from "csv-parser";
import Order from "../models/orderModel.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // const orders = [];  // Array to hold the transformed orders

    // // Read and parse CSV file
    // fs.createReadStream("result.csv")
    //   .pipe(csv())
    //   .on("data", (row) => {
    //     // Transform the CSV row into the structure required for MongoDB
    //     const order = {
    //       id: row.id,  // Use the order ID from the CSV file
    //       user: {
    //         name: row["user/name"],  // Flattened 'user/name' from CSV becomes 'name' in 'user' object
    //         email: row["user/email"],  // Flattened 'user/email' from CSV becomes 'email' in 'user' object
    //       },
    //       orderItems: [
    //         {
    //           name: row["orderItems/0/name"],  // Item name from the CSV
    //           price: parseFloat(row["orderItems/0/price"]),  // Convert price to number
    //           size: row["orderItems/0/size"],  // Item size from the CSV
    //           image: row["orderItems/0/image"],  // Item image URL from the CSV
    //         },
    //       ],
    //       shippingAddress: {
    //         address: row["shippingAddress/address"],  // Shipping address from CSV
    //         city: row["shippingAddress/city"],  // City from the shipping address
    //         pincode: row["shippingAddress/pincode"],  // Pincode from the shipping address
    //       },
    //       paymentMethod: row.paymentMethod,  // Payment method from the CSV
    //       note: row.note,  // Any note for the order
    //       itemsPrice: parseFloat(row.itemsPrice),  // Convert itemsPrice to number
    //       shippingPrice: parseFloat(row.shippingPrice),  // Convert shippingPrice to number
    //       totalPrice: parseFloat(row.totalPrice),  // Convert totalPrice to number
    //       deliveryStatus: row.deliveryStatus,  // Delivery status from CSV
    //       createdAt: new Date(row.createdAt),  // Convert the string date to a Date object
    //       isCancelled: row.isCancelled === "true",  // Convert string 'true'/'false' to boolean
    //     };

    //     // Push the transformed order into the orders array
    //     orders.push(order);
    //   })
    //   .on("end", async () => {
    //     // Once all CSV data is read and transformed, insert into MongoDB
    //     try {
    //       // Insert the orders array into the MongoDB collection
    //       const result = await Order.insertMany(orders);
    //       console.log("Orders inserted:", result);  // Log the result of the insertion
    //     } catch (err) {
    //       console.error("Error inserting orders into MongoDB:", err);  // Log any errors
    //     }

    //     // Close the MongoDB connection after insertion
    //     mongoose.connection.close();
    //   });





//     try {
//       const createdProducts = await Product.insertMany([
//         // Accessories
//         {
//           name: "Canvas Cosmetic Pouch",
//           desc: `Self-care meet Sustainability.

// Take care of yourself and the planet with our 100% reusable Zero-Waste accessories.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 44,
//               price: 32,
//               inStock: true,
//             },
//           ],
//           category: "accessories",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/13631962-1724936838046102.jpg?v=1686213936&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13631962-5624936839020100.jpg?v=1690457387&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/Shot_10_058.jpg?v=1690457387&width=1920",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Chiffon",
//           desc: `Self-care meet Sustainability. Take care of yourself and the planet with our 100% reusable Zero-Waste accessories.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 34,
//               inStock: true,
//             },
//           ],
//           category: "accessories",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/qO6_Jzer-min_1_3a498fc8-e580-4f08-a641-b23fad976819.jpg?v=1690456653&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/13631960-1704936837102266.jpg?v=1690456653&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13631960-2044936837248813.jpg?v=1690456653&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13631960-1104936837418601.jpg?v=1690456653&width=1500",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Muslin Knotwrap",
//           desc: `Meet our muslin Knotwrap. Use me to wrap your favorite skincare goodies when you travel or tie me in your hair to create a chic headband or turban. I make a great gift too.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 12,
//               inStock: true,
//             },
//           ],
//           category: "accessories",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/0K6A8171.jpg?v=1749815450&width=1638",
//             "https://www.plenaire.co/cdn/shop/files/13631961-1054936837601799.jpg?v=1690449850&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13631960-2044936837248813.jpg?v=1690456653&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13631960-1104936837418601.jpg?v=1690456653&width=1500",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Fancy face cloth",
//           desc: `Meet our muslin Knotwrap. Use me to wrap your favorite skincare goodies when you travel or tie me in your hair to create a chic headband or turban. I make a great gift too.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 32,
//               inStock: true,
//             },
//           ],
//           category: "accessories",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/13631960-1104936837418601.jpg?v=1690456653&width=1500",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         //   Cleansers
//         {
//           name: "Makeup Lover : Makeup Remover and Foaming Cleanser",
//           desc: `Own your true colours. When I wear makeup, I do it for myself. There’s power in self-expression. And freedom in fluidity. I change my mind all the time - so why not switch up my look too? At night, the colours wash off of my face like rainbows and swirl into the sink below. This set contains Rose Jelly 100ml * Daily Airy 120ml`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 66,
//               price: 55,
//               inStock: true,
//             },
//           ],
//           category: "cleansers",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/13839834-1984960383756174.jpg?v=1686213276&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13839834-1664960383888351.jpg?v=1686213276&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13839834-1124960383954678.jpg?v=1686213276&width=1500",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Chapter One",
//           desc: `That first day feeling. When the morning sunlight streams through my window, I let myself get lost in the feeling of endless possibility. Like the creaminess of a blank page asking to be composed. Starting a new chapter is empowering. I stretch, connect my feet to the floor, and begin. This set contains : Daily Airy 120ml * Tropique 180ml * Droplet 50ml`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 96,
//               price: 80,
//               inStock: true,
//             },
//           ],
//           category: "cleansers",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/13839831-8304960434324975.jpg?v=1686213361&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13839831-1114960434410181.jpg?v=1686213361&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13839831-1324960434462306.jpg?v=1686213361&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13839831-1194960434515631.jpg?v=1686213362&width=1500",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Daily Airy Self Foaming Cleanser",
//           desc: `TKeep your head in the clouds. This gentle foaming cleanser works on all skin types to remove impurities and lightweight makeup without disrupting your skin's natural oil and moisture barrier.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 27,
//               inStock: true,
//             },
//           ],
//           category: "cleansers",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/product7_665a9283-35d6-4c0b-81ff-8f22798fe1bd.png?v=1683715155&width=640",
//             "https://www.plenaire.co/cdn/shop/files/13312678-9294956787562472.jpg?v=1686563184&width=1500",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Rose Jelly Gentle Makeup Remover",
//           desc: `Like wearing rose tinted glasses for your skin. This conditioning formula has a unique, jelly-like texture that works to rapidly dissolve makeup and impurities while soothing and cooling skin.`,
//           variants: [
//             {
//               label: "30ml",
//               discountPrice: 0,
//               price: 27,
//               inStock: true,
//             },
//             {
//               label: "100ml",
//               discountPrice: 50,
//               price: 39,
//               inStock: false,
//             },
//           ],
//           category: "cleansers",
//           img: [
//             "https://www.plenaire.co/cdn/shop/products/LukeWeller-Plenaire_Ecom_Rose_Jelly_100ml.jpg?v=1694391217&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/gempages_556406198862086924-e2beb438-e01b-4986-9ad9-7584ac26d4f0.webp?v=1745829790&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/13321696-6894953202961037.jpg?v=1745829790&width=1500",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         //   skincare
//         {
//           name: "Aesthetique Retexturing Treatment Serum",
//           desc: `t will be more beautiful than you could ever imagine. Combining the unparalleled brightening benefits of AHAs wrapped within a nourishing blend of 3 pure plant oils, this pampering treatment serum helps to retexture and deeply exfoliate your skin. Ten percent of the profits from Plenaire Aesthetique will go to Anna Freud, a world-leading charity striving to build the mental wellbeing of the next generation.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 55,
//               inStock: true,
//             },
//           ],
//           category: "skincare",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/plenaireaesthetique-9110_1.jpg?v=1699604841&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/9CB6F232-DED9-46D3-878B-B48BCE26B1EB_5498abf2-0087-460d-b5dc-685992adb924.jpg?v=1699604841&width=1060",
//             "https://www.plenaire.co/cdn/shop/files/13321696-6894953202961037.jpg?v=1745829790&width=1500",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Tropique Enzymatic Exfoliant",
//           desc: `Take a walk on the bright side. 

// This gentle exfoliating tonic uses natural fruit acids to renew your natural glow and provide antioxidant repair, leading to noticeably brighter, more evenly toned skin.`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 31,
//               inStock: true,
//             },
//           ],
//           category: "skincare",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/product1.png?v=1683304633&width=640",
//             "https://www.plenaire.co/cdn/shop/files/13312677-1234956787965804.jpg?v=1686210998&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13321696-6894953202961037.jpg?v=1745829790&width=1500",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Tripler 3-in-1 Exfoliating Clay",
//           desc: `It's OK to believe in superheroes. This multitasker is a mask, cleanser, and gentle exfoliator all wrapped into one. In minutes, it works to detoxify, polish, and renew your skin to reveal a smoother, naturally brighter complexion.`,
//           variants: [
//             {
//               label: "30ml",
//               discountPrice: 24,
//               price: 31,
//               inStock: true,
//             },
//             {
//               label: "100ml",
//               discountPrice: 50,
//               price: 42,
//               inStock: true,
//             },
//           ],
//           category: "skincare",
//           img: [
//             "https://www.plenaire.co/cdn/shop/products/LukeWeller-Plenaire_Ecom_Tripler_100ml.jpg?v=1689673194&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/13321698-1234956781128153.jpg?v=1689673194&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13321698-2054953203078460.jpg?v=1694523941&width=1500",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "The Birthday Edit",
//           desc: `The essentials, our best sellers in one set. This collection contains our essential best sellers that have sold out, again and again. Violet Paste is your go to for clear skin: working overnight to help combat and keep blemishes at bay. Rose Jelly works as an ideal daily cleanse to effectively remove makeup and impurities without disturbing skin’s delicate barrier. Working together, our two best selling products leave skin glowing and beautiful. This set contains Violet Paste 30g * Rose Jelly 100ml`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 106,
//               price: 82,
//               inStock: true,
//             },
//           ],
//           category: "skincare",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/Plenaire_Ecom_Groups_The_BestsellersFoundersedit.jpg?v=1749815450&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/ConvertOut-Resized-TheFactoryDigital_Plenaire_RoseJelly__100ml_3.jpg?v=1725791740&width=846",
//             "https://www.plenaire.co/cdn/shop/files/product2.png?v=1747227707&width=6400",
//             "https://www.plenaire.co/cdn/shop/files/5ecbd6c8-68e9-45c2-af84-efdc33cf72f0.jpg?v=1725898343&width=1275",
//           ],
//           bestSellers: false,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Starting Over",
//           desc: `Start a new beginning for your skin with this set. This collection is your gentle yet effective antidote to achieving evenly pigmented, smooth and bright skin over time. Aesthetique retexturing serum works overnight to refine imperfections, hyperpigmentation and reveal brighter more beautiful skin. Skin Frosting hydrates, deeply replenishes, and restore the ideal moisture balance to skin the next day. Working together, our two best selling products leave skin glowing and beautiful. This set contains Aesthetique 30g * Skin Frosting 100ml`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 0,
//               price: 81,
//               inStock: true,
//             },
//           ],
//           category: "skincare",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/Plenaire_Ecom_Groups_The_BestsellersFoundersedit.jpg?v=1749815450&width=1920",
//             "https://www.plenaire.co/cdn/shop/files/ConvertOut-Resized-TheFactoryDigital_Plenaire_RoseJelly__100ml_3.jpg?v=1725791740&width=846",
//             "https://www.plenaire.co/cdn/shop/files/product2.png?v=1747227707&width=6400",
//             "https://www.plenaire.co/cdn/shop/files/5ecbd6c8-68e9-45c2-af84-efdc33cf72f0.jpg?v=1725898343&width=1275",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         //   moisturisers
//         {
//           name: "Droplet Lightweight Moisture Gel",
//           desc: `Lightweight hydration with a sheer, mattified finish—effortless, breathable, and perfectly balanced for everyday wear.`,
//           variants: [
//             {
//               label: "50ml",
//               discountPrice: 0,
//               price: 39,
//               inStock: true,
//             },
//             {
//               label: "100ml",
//               discountPrice: 0,
//               price: 50,
//               inStock: false,
//             },
//           ],
//           category: "moisturisers",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/grid-2_c7589796-99b7-4ceb-8c95-dfb4fab8f0d5.png?v=1683715226&width=1440",
//             "https://www.plenaire.co/cdn/shop/files/product-t1.png?v=1686563248&width=400",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//         {
//           name: "Celebration",
//           desc: `There’s always a reason to celebrate. The best gifts are totally unexpected. Getting one feels like a burst of confetti across your day. I take that feeling with me and hold it close, passing it to others along the way… This set contains Tripler 100ml * Skin Frosting 100ml`,
//           variants: [
//             {
//               label: "default",
//               discountPrice: 87,
//               price: 73,
//               inStock: true,
//             },
//           ],
//           category: "moisturisers",
//           img: [
//             "https://www.plenaire.co/cdn/shop/files/13839830-1084960382781945.jpg?v=1686213558&width=1500",
//             "https://www.plenaire.co/cdn/shop/files/13839830-1534960994275395.jpg?v=1686213557&width=1500",
//           ],
//           bestSellers: true,
//           new: false,
//           info: "Creamy, dreamy, with delicate tropical notes—this mask is pure bliss. Raw coconut oil, cocoa butter, shea butter, and coveted Japanese tsubaki (camellia oil) combine to create a super nourishing formula that leaves skin feeling relaxed and looking dewy and hydrated. Perfect for any time you want to unwind, but especially comforting during drier months. Also available in a 30ml travel size for a “post beach” or “on flight” treat, as featured in our set, the Best Of Plenaire.",
//           keybenefits: `Helps skin recover from exposure to extreme temperatures or dryness.

// Helps boost skin’s elasticity and moisture retention.

// Soothes and calms skin with anti-inflammatory and natural ingredients.`,
//           directions: `Apply a thick layer to cleansed, dry skin. Relax for 15-20 minutes. Wipe off excess with a warm washcloth or a damp towel—no need to rinse. For best results, follow with Droplet moisture gel. Gentle enough for daily use. Perfect for sensitive and delicate skin.`,
//           ingredients: `
//     ACTIVE INGREDIENTS:
// Coconut Oil
// Cocoa Butter, Shea Butter
// Precious Japanese Camellia Oil (Tsubaki)
// Plant Phytosterols and Triglycerides

// KEY INGREDIENTS: Coconut Oil, Cocoa Butter, Shea Butter, Precious Japanese Camellia Oil (Tsubaki), Plant Phytosterols and Triglycerides. FULL INGREDIENTS: Aqua (Water), Squalane, Glycerin, Polyglyceryl-3 Polyricinoleate, Butyrospermum Parkii (Shea) Butter, Euphorbia Cerifera (Candelilla Cera) Wax, Theobroma Cacao (Cocoa) Seed Butter, Sorbitan Sesquioleate, Cocos Nucifera (Coconut) Oil, Sucrose Distearate, Camellia Japonica Seed Oil, Benzyl Alcohol, Magnesium Sulfate, Polyglyceryl-3 Ricinoleate, Salicylic Acid, Parfum (Fragrance), Tocopherol, Mica, Sorbic Acid, Tin Oxide, CI 77510 (Ferric Ferrocyanide), CI 77491 (Iron Oxide), CI 77891 (Titanium Dioxide)`,
//         },
//       ]);
//       console.log("Products Imported Successfully:", createdProducts);
//       process.exit(); // Exit the process after completion
//     } catch (error) {
//       console.error("Error Importing Products:", error);
//       process.exit(1); // Exit the process with failure
//     }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
