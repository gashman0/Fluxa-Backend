import express from 'express';
import { protectUser } from '../../middleware/protectUser.js';
import { saveJob } from '../../controllers/job/save-job-controller.js';

const saveJobsRouter = express.Router();

saveJobsRouter.post("/:jobId", protectUser, saveJob);


export default saveJobsRouter