import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.ObjectId,
        ref: "Admin",
        required: true,
    },

    otpHash: {
        type: String,
        required: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    }
}, {timestamps: true});

otpSchema.index(
    {expiresAt: 1},
    {expireAfterSeconds: 0},
)

export default mongoose.model("OTP", otpSchema);