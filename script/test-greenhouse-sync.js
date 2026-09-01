import dotenv from 'dotenv'
import connectDB from "../config/db.js";
import { syncGreenhouseJobs } from "../intergrations/greenhouse/greenhouse-sync-service.js";

dotenv.config();

const run = async () => {
    try {
        await connectDB();
        await syncGreenhouseJobs();

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

run()