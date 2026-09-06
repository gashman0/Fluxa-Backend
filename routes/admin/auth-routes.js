import express from "express";
import { adminLogin } from "../../controllers/admin-auth/login-controller.js";
import { verifyOtp } from "../../controllers/admin-auth/otp-controller.js";


const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/otp", adminRouter);

export default adminRouter;