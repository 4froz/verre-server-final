import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import User from "./functions/models/userModel.js"; // ✅ Make sure this path is correct

dotenv.config();

// 1. Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/fakeusers", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

// 2. Generate Fake Users
const generateUsers = async (count) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(" ")[0] });

    const hashedPassword = await bcrypt.hash("123456", 10); // Optional: if you want password field

    users.push({
      name,
      email,
      isAdmin: false,
      profilePic: faker.image.avatar(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return users;
};

// 3. Seed Database
const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany(); // Optional: Clear existing users
    console.log("🗑️ Existing users removed");

    const fakeUsers = await generateUsers(1000);

    await User.insertMany(fakeUsers);
    console.log(`✅ ${fakeUsers.length} fake users inserted into MongoDB`);

    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedUsers();
