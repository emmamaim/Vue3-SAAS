import express from 'express';
import * as systemController from '../controllers/systemController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 獲取所有初始字典數據
router.get('/init', auth, systemController.getSystemInitData);
router.get('/jobs/:categoryId', auth, systemController.getJobsByCategory);

export default router;
