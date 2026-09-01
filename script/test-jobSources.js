import connectDB from "../config/db.js";
import { getActiveGreenHouseSources } from "../intergrations/greenhouse/greenhouse-sync-service.js";
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const sources = await getActiveGreenHouseSources();

    console.log(sources);
  } catch (err) {
    console.error(err);
  }
};

run();