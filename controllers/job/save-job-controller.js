import mongoose from 'mongoose';
import savedJobModel from "../../models/saved-job-model.js";
import jobModel from "../../models/job-model.js";

export const saveJob = async (req, res) => {
    try{
        const userId = req.user.id;
        const { jobId } = req.params;

        // Validate job Id
        if(!mongoose.Types.ObjectId.isValid(jobId)){
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        // Check if the job exists
        const job = await jobModel.findById(jobId);

        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Check if the user has already saved this job
        const existingSavedJob = await savedJobModel.findOne({
            user: userId,
            job: jobId,
        });

        if(existingSavedJob) {
            return res.status(409).json({
                success: false,
                message: "You have already saved this job",
            });
        }

        // Save the job
        const saveJob = await savedJobModel.create({
            user: userId,
            job: jobId,
        });

        return res.status(201).json({
            success: true,
            message: "Job saved successfully",
            saveJob,
        });
    }catch(error) {
        console.error("Save job error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error on save job"
        });
    }
};