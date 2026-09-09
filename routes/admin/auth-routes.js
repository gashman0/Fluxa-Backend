import express from "express";
import { adminLogin } from "../../controllers/admin-auth/login-controller.js";
import { verifyOtp } from "../../controllers/admin-auth/otp-controller.js";
import { getMeAdmin } from "../../controllers/user/adminMe-controller.js";
import { protect } from "../../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/otp", verifyOtp);
adminRouter.get("/me", protect, getMeAdmin);

export default adminRouter;