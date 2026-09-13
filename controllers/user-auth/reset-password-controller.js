import userModel from "../../models/user-model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const resetPassword = async (req, res) => {
    try {
        const { token, password} = req.body;

        // Make sure token and password were provided
        if(!token || !password){
            return res.status(400).json({
                message: "Token and password are required",
            });
        }

        // Hash the token received from the frontend
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find the user with a matching token that has not expired
        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: new Date()},
        });

        // Invalid or expired token
        if(!user){
            return res.status(400).json({
                message: "Password reset link is invalid or has expired",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        user.password = hashedPassword;

        // Invalidate the reset token
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            message: "Password reset successful",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};