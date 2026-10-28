import jobModel from "../../models/job-model.js";

export const getJobs = async (req, res) => {

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [jobs, totalJobs] = await Promise.all([
            jobModel.find().sort({ publishedAt: -1}).skip(skip).limit(limit).lean(),
            jobModel.countDocuments(),
        ]);

        const totalPages = Math.ceil(totalJobs / limit);

        // const jobs = await jobModel.find().sort({publishedAt: -1}).lean();

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs,
            pagination:{
                page,
                limit,
                totalJobs,
                totalPages,
                NextPage: page < totalPages,
                PreviousPage: page > 1
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error fetching jobs"
        })
    }
}