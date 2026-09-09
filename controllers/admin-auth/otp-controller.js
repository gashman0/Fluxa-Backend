import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import adminModel from "../../models/admin.model.js";
import otpModel from "../../models/otp-model.js";

export const verifyOtp = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const { adminId, otp } = req.body || {};

    // Validate request
    if (!adminId || !otp) {
      return res.status(400).json({
        message: "Admin ID and OTP are required",
      });
    }

    // Validate admin ID
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

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      await otpModel.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Compare submitted OTP with stored hash
    const isValidOtp = await bcrypt.compare(
      otp,
      otpRecord.otpHash,
    );

    if (!isValidOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP is valid — consume it
    await otpModel.deleteOne({
      _id: otpRecord._id,
    });

    // Create access token
    const accessToken = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      },
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      {
        id: admin._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Set admin access token
    res.cookie("adminAccessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 30,
    });

    // Set admin refresh token
    res.cookie("adminRefreshToken", refreshToken, {
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