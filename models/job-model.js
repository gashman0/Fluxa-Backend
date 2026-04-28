import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    description: String,
    location: String,
    url: String,
    source: String,
    tags: String, // Dont know why this is here shaa
}, {timestamps});

export default mongoose.model("Job", jobSchema);