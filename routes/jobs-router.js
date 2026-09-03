import express from 'express';
import { protect } from '../middleware/auth.js';
import { getJobs } from '../controllers/job/jobs-controller.js';


const jobRouther = express.Router();

jobRouther.get("/jobs", protect, getJobs);

export default jobRouther;