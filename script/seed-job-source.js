import dotenv from 'dotenv';
import connectDB from "../config/db.js";
// import JobSource from "../models/job-sources-model.js";
import jobSoursesModel from '../models/job-sourses-model.js';



dotenv.config();

const sources = [
  {
    company: "Vercel",
    provider: "greenhouse",
    identifier: "vercel",
    active: true,
  },
  {
    company: "Stripe",
    provider: "greenhouse",
    identifier: "stripe",
    active: true,
  },
  {
    company: "Figma",
    provider: "greenhouse",
    identifier: "figma",
    active: true,
  },
  {
    company: "Notion",
    provider: "greenhouse",
    identifier: "notion",
    active: true,
  },
];

const run = async () => {
  try {
    await connectDB();
    await jobSoursesModel.insertMany(sources);

    console.log("Job sources seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();