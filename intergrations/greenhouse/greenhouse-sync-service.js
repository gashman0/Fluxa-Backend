import jobSoursesModel from '../../models/job-sourses-model.js';
import { getBoardJobs } from './greenhouse-service.js';
import { normalizeGreenhouseJob } from './greenhouse-normalizer.js';
import Job from '../../models/job-model.js'

export const syncGreenhouseJobs = async () => {
    const sources = await jobSoursesModel.find({
        provider: "greenhouse",
        active: true,
    });

    for (const source of sources) {
        try{

            console.log(`Fetching jobs from ${source.company}...`);
    
            const jobs = await getBoardJobs(source.identifier);
    
            console.log(`${source.company}: ${jobs.length} jobs found`);

            const normalizedJobs = jobs.map(normalizeGreenhouseJob);

            await Job.insertMany(normalizedJobs, {
                ordered: false,
            });

            console.log(
                `${source.company}: ${normalizedJobs.length} jobs saved`
            );
        }catch(error){
            console.error(
                `Failed to fetch jobs from ${source.company}`,
                error.response?.data || error.message
            );
        }
    }
};