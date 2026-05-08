import express from "express";
import { protect } from "../middleware/auth.js";
import { signup } from "../controllers/auth/signup-controller.js";
import { login } from "../controllers/auth/login-controller.js";
import { refresh } from "../controllers/auth/refresh-controller.js";
import { logout } from "../controllers/auth/logout-controller.js";
import { getMe } from "../controllers/user/me.js";
import { checkAuth } from "../controllers/auth/check-auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/checkAuth", checkAuth)

router.get("/me", protect, getMe);

export default router;
