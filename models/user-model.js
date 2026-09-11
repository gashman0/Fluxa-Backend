import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    }
}, {timestamps: true});


export default mongoose.model("User", userSchema);