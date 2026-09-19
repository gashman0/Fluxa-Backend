import mongoose from "mongoose";

const trasactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reference: {
            type: String,
            required: true,
            unique: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "NGN",
        },

        product: {
            type: String,
            required: true,
        },

        provider: {
            type: String,
            default: "paystack",
        },

        status: {
            type: String,
            enum: ["pending", "success", "failed", "abandoned", "reversed"],
            default: "pending",
        },

        fullfillmentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },

        paidAt: {
            type: Date,
            default: null,
        },


    },
    {timestamps: true}
);

const transactionModel = mongoose.model(
    "Transaction", trasactionSchema
);

export default transactionModel;