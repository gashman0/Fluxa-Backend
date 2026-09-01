import { getBoardJobs, getJobDetails } from "../intergrations/greenhouse/greenhouse-service.js";


const run = async () => {
  try {
    const jobs = await getBoardJobs("vercel");
    
    const job = await getJobDetails("vercel", jobs[0].id);


    // console.log(jobs[0]);

    console.log("The Job:", job)
  } catch (err) {
    console.error(err);
  }
};

run();