import express from 'express';
import { signup } from '../controllers/signup-controller.js';
import { login } from '../controllers/login-controller.js';
import { refresh } from '../controllers/refresh-controller.js';
import { logout } from '../controllers/logout-controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;