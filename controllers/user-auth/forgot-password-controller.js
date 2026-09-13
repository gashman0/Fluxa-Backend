import userModel from "../../models/user-model.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../../services/email-service.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user
    const user = await userModel.findOne({ email });

    // Don't reveal whether the email exists or not
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password resent has been sent.",
      });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing it
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15minutes
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save the hashed token and expiration
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save();

    // For configuring the email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    console.log("Password reset Url:", resetUrl);

    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (emailError) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      message:
        "If an account with email exist, a password reset link has been sent.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
