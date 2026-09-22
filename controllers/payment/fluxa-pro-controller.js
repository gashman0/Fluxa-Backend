import crypto from "crypto";
import transactionModel from "../../models/transaction-model.js";
import userModel from "../../models/user-model.js";
import { initializeTransaction } from "../../services/payment/paystack-service.js";

export const initializePayment = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // console.log("Authenticated user:", user);

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

      data: {
        authorizationUrl: payment.data.authorization_url,
        reference: payment.data.reference,
      },
    });
  } catch (error) {
    console.error(
      "Payment initialization error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: "Unable to initialize payment",
    });
  }
};

export const handlePaystackWebhook = async (req, res) => {
  try {
    console.log("Paystack webhook received");
    console.log("Raw body:", req.rawBody);
    console.log("Parsed body:", req.body);

    const signature = req.headers["x-paystack-signature"];

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.rawBody)
      .digest("hex");

    // Compare the signature from paystakc and the one I generated
    const signatureBuffer = Buffer.from(signature || "", "utf8");
    const hashBuffer = Buffer.from(hash, "utf8");

    if (
      signatureBuffer.length !== hashBuffer.length ||
      !crypto.timingSafeEqual(hashBuffer, signatureBuffer)
    ) {
      return res.sendStatus(401);
    }

    const event = req.body;
    const paystackTransaction = event.data;

    const reference = event.data.reference;

    // Check if the reference from paystack is exactly the one we provided and saved
    const transaction = await transactionModel.findOne({
      reference,
    });

    console.log("Our transaction:", transaction);

    if (!transaction) {
      console.error("Transaction not found:", reference);
      return res.sendStatus(404);
    }

    // Prevent duplicate fullfillment
    if (transaction.status === "success") {
      console.log("Transaction already processed:", reference);
      return res.sendStatus(200);
    }

    // Verify important payment details
    if (paystackTransaction.status !== "success") {
      console.error("Payment was not successful:", reference);
      return res.sendStatus(200);
    }

    // Verify amount
    if (paystackTransaction.amount !== transaction.amount) {
      console.error("Amount mismatch:", {
        expected: transaction.amount,
        received: paystackTransaction.amount,
      });

      return res.sendStatus(400);
    }

    // Verify currency
    if (paystackTransaction.currency !== transaction.currency) {
      console.error("Currency mismatch:", {
        expected: transaction.currency,
        received: paystackTransaction.currency,
      });

      return res.sendStatus(400);
    }

    // Now the payment has been verified, lets find the user that made the payment
    const user = await userModel.findById(transaction.user);

    if(!user){
      console.error(
        "User not found for transaction:", transaction._id,
      );

      return res.sendStatus(404);
    }

    // Mark transaction as successful
    transaction.status = "success";
    transaction.paidAt = new Date(paystackTransaction.paid_at);

    // Fulfill the product
    transaction.fulfillmentStatus = "fulfilled";

    await transaction.save();

    user.subscription.plan = "pro";
    user.subscription.status = "active";
    user.subscription.provider = "paystack";

    await user.save();

    console.log("Transaction successfully completed:", reference);
    console.log("Fluxa Pro activated for:", user.email);

    // console.log("Paystack webhook received:", event);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Paystack webhook error", error);
    return res.sendStatus(500);
  }
};
