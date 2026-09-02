import jobModel from "../../models/job-model.js";

export const getJobs = async (req, res) => {

    try {
        const jobs = await jobModel.find().sort({publishedAt: -1}).lean();

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error fetching jobs"
        })
    }
}