import express from "express";
import { protectUser } from "../../middleware/protectUser.js";
import { getJobs } from "../../controllers/job/jobs-controller.js";

const jobRouther = express.Router();

jobRouther.get("/jobs", protectUser, getJobs);

export default jobRouther;
