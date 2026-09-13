import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,

    email: {type: String, unique: true},

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
    }

}, {timestamps: true});


export default mongoose.model("User", userSchema);