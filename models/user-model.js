import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: { type: String, unique: true },

    password: String,

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free",
      },

      status: {
        type: String,
        enum: ["inactive", "active", "cancelled", "expired"],
        default: "inactive",
      },

      provider: {
        type: String,
        enum: ["paystack"],
        default: null,
      },

      subscriptionCode: {
        type: String,
        default: null,
      },

      customerCode: {
        type: String,
        default: null,
      },

      currentPeriodStart: {
        type: Date,
        default: null,
      },

      currentPeriodEnd: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
