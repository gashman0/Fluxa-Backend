import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import adminModel from "../models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONG0_URI);

    console.log("Connected to MongoDB");

    const email = "gashman878@gmail.com";
    const password = "kjfu4309kejrKJgoijqerg09459%*&^";

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await adminModel.create({
      name: "Admin Gash",
      email,
      phone: 8140894435,
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    console.log({
      id: admin._id,
      email: admin.email,
    });
  } catch (error) {
    console.error("Failed to seed admin:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();