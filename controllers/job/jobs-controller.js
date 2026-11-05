import jobModel from "../../models/job-model.js";

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getJobs = async (req, res) => {

    try {
        // Get query parameters
        const search = req.query.search?.trim() || "";
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20 ));
        const skip = (page - 1) * limit;

        // Create the Mongodb filter
        const filter = {};

        if(search){
            const searchRegex = {
                $regex: escapeRegex(search),
                $options: "i",
            };

            filter.$or = [
                {title: searchRegex},
                {company: searchRegex},
                {description: searchRegex},
                {location: searchRegex},
            ];
        }

        // Fetch matching jobs and count matching documents
        const [jobs, totalJobs] = await Promise.all([
            jobModel.find(filter).sort({ publishedAt: -1}).skip(skip).limit(limit).lean(),
            jobModel.countDocuments(filter),
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
        console.error("Error fetching jobs:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error fetching jobs"
        });
    }
};