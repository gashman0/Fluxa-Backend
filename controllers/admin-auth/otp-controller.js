import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import adminModel from "../../models/admin.model.js";
import otpModel from "../../models/otp-model.js";

export const verifyOtp = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const { adminId, otp } = req.body;

    // Validae request
    if (!adminId || !otp) {
      return res.status(400).json({
        message: "Admin Id and OTP are required",
      });
    }

    // Validate adminId
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({
        message: "Invalid verification request",
      });
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Make sure the admin still exists
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(400).json({
        message: "Invalid verification request",
      });
    }

    // Find the OTP belonging to this admin
    const otpRecord = await otpModel.findOne({
      adminId: admin._id,
    });
    console.log("Admin ID:", admin._id);
    console.log("OTP record:", otpRecord);

    if (!otpRecord) {
      console.log("❌ No OTP record found");
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    console.log("Current time:", new Date());
    console.log("OTP expires at:", otpRecord.expiresAt);
    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      console.log("OTP has expired");
      await otpModel.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "Invalid or expired",
      });
    }

    // Compare submitted OTP with stored hash
    console.log("Submitted OTP:", otp);
    console.log("Stored OTP hash:", otpRecord.otpHash);

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otpHash);
    console.log("OTP valid:", isValidOtp);

    if (!isValidOtp) {
      return res.status(400).json({
        message: "Invalid or expired OTP from hash",
      });
    }

    // Create access token
    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    // Create refresh token
    const refrshToken = jwt.sign(
      { id: admin._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "1d" },
    );

    // Set access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 30,
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refrshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
