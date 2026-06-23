import { getBoardJobs } from "../intergrations/greenhouse/greenhouse-service.js";

const run = async () => {
  try {
    const jobs = await getBoardJobs("vercel");

    console.log(jobs[0]);
  } catch (err) {
    console.error(err);
  }
};

run();