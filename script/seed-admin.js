import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import adminModel from "../models/admin.model.js";


const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONG0_URI);

    const existingAdmin = await adminModel.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await adminModel.create({
      name: "Admin Gash",
      email: "gashman878@gmail.com",
      phone: 8140894435,
      password: hashedPassword,
    });

    console.log("Admin seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();