import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import Order from "./orderModel.js";  // Assuming the order model is in the 'models' folder

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const orders = [];  // Array to hold the transformed orders

// Read and parse CSV file
fs.createReadStream("orders.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Transform the CSV row into the structure required for MongoDB
    const order = {
      id: row.id,  // Use the order ID from the CSV file
      user: {
        name: row["user/name"],  // Flattened 'user/name' from CSV becomes 'name' in 'user' object
        email: row["user/email"],  // Flattened 'user/email' from CSV becomes 'email' in 'user' object
      },
      orderItems: [
        {
          name: row["orderItems/0/name"],  // Item name from the CSV
          price: parseFloat(row["orderItems/0/price"]),  // Convert price to number
          size: row["orderItems/0/size"],  // Item size from the CSV
          image: row["orderItems/0/image"],  // Item image URL from the CSV
        },
      ],
      shippingAddress: {
        address: row["shippingAddress/address"],  // Shipping address from CSV
        city: row["shippingAddress/city"],  // City from the shipping address
        pincode: row["shippingAddress/pincode"],  // Pincode from the shipping address
      },
      paymentMethod: row.paymentMethod,  // Payment method from the CSV
      note: row.note,  // Any note for the order
      itemsPrice: parseFloat(row.itemsPrice),  // Convert itemsPrice to number
      shippingPrice: parseFloat(row.shippingPrice),  // Convert shippingPrice to number
      totalPrice: parseFloat(row.totalPrice),  // Convert totalPrice to number
      deliveryStatus: row.deliveryStatus,  // Delivery status from CSV
      createdAt: new Date(row.createdAt),  // Convert the string date to a Date object
      isCancelled: row.isCancelled === "true",  // Convert string 'true'/'false' to boolean
    };

    // Push the transformed order into the orders array
    orders.push(order);
  })
  .on("end", async () => {
    // Once all CSV data is read and transformed, insert into MongoDB
    try {
      // Insert the orders array into the MongoDB collection
      const result = await Order.insertMany(orders);
      console.log("Orders inserted:", result);  // Log the result of the insertion
    } catch (err) {
      console.error("Error inserting orders into MongoDB:", err);  // Log any errors
    }

    // Close the MongoDB connection after insertion
    mongoose.connection.close();
  });
