import express from 'express';
import * as systemController from '../controllers/systemController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 獲取所有初始數據
router.get('/init', auth, systemController.getSystemInitData);

// 管理員配置管理
router.get('/settings/:type', auth, isAdmin, systemController.getAdminSettings);

// 新增或更新配置
router.post('/settings/:type', auth, isAdmin, systemController.saveSetting);

// 刪除特定配置 (含 checkUsage 安全檢查)
router.delete('/settings/:type/:id', auth, isAdmin, systemController.deleteSetting);

export default router;
