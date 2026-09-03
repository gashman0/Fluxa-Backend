import express from "express";
import { protect } from "../middleware/auth.js";
import { signup } from "../controllers/auth/signup-controller.js";
import { login } from "../controllers/auth/login-controller.js";
import { refresh } from "../controllers/auth/refresh-controller.js";
import { logout } from "../controllers/auth/logout-controller.js";
import { getMe } from "../controllers/user/me.js";

// import { getJobs } from "../controllers/job/jobs-controller.js";


const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);

// authRouter.get("/jobs", protect, getJobs);

export default authRouter;
