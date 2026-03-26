import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
// 需要經過 auth 中間件驗證 Cookie
router.get('/me', auth, getMe);

export default router;
