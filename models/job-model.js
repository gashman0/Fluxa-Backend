import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    company: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    location: {
        type: String,
        default: "",
    },

    url: {
        type: String,
        required: true,
    },

    source: {
        type: String,
        required: true,
    },

    externalId: {
        type: String,
        required: true,
    },

    publishedAt: {
        type: Date,
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },

}, {timestamps: true});

jobSchema.index(
    {source: 1, externalId: 1},
    {unique: true}
)

export default mongoose.model("Job", jobSchema);