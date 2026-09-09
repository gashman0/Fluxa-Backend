import express from "express";
import { adminLogin } from "../../controllers/admin-auth/login-controller.js";
import { adminLogout } from "../../controllers/admin-auth/logout-controller.js";
import { verifyOtp } from "../../controllers/admin-auth/otp-controller.js";
import { getMeAdmin } from "../../controllers/user/adminMe-controller.js";
import { protectAdmin } from "../../middleware/protectAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/otp", verifyOtp);
adminRouter.post("/logout", adminLogout); 


adminRouter.get("/me", protectAdmin, getMeAdmin);

export default adminRouter;
