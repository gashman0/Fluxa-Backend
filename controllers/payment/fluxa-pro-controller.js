import crypto from "crypto";
import transactionModel from "../../models/transaction-model.js";
import userModel from "../../models/user-model.js";
import { initializeTransaction } from "../../services/payment/paystack-service.js";

export const initializePayment = async (req, res) => {
    try{
        const user = await userModel.findById(req.user.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        console.log("Authenticated user:", user);

        const amount = 50000;

        const product = "fluxa_pro";

        const reference = `FLX_${crypto.randomBytes(12).toString("hex")}`;


        // Save the transaction in our db
        const transaction = await transactionModel.create({
            user: user._id,
            reference,
            amount,
            currency: "NGN",
            product,
            provider: "paystack",
            status: "pending",
        });

        // Initialize the transaction with paystack
        const payment = await initializeTransaction({
            email: user.email,
            amount,
            reference,
        });

        return res.status(200).json({
            message: "Payment initialized successfully",

            data:{
                authorizationUrl: payment.data.authorization_url,
                reference: payment.data.reference,
            },
        });

    }catch (error) {
        console.error(
            "Payment initialization error:", error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Unable to initialize payment",
        });
    }
};