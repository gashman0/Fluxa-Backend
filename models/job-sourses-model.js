import mongoose from "mongoose";

const jobSource = new mongoose.Schema({
    company: String,
    provider: String,
    identifier: {type: String, required: true},
    active: Boolean,
}, {timestamps: true});

export default mongoose.model("JobSource", jobSource);