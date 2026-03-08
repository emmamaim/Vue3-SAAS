import express from 'express';
import * as userController from '../controllers/userController.js';
// JWT 驗證中介軟體（確保只有登入者能查）
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
// 登入（無需認證
router.post('/login', userController.login);

// 管理員專用路由（需要認證和管理員權限）
router.get('/hr-list', auth, userController.getHrList);
router.get('/', auth, isAdmin, userController.getUserList);
router.post('/', auth, isAdmin, userController.createUser);
router.put('/:id', auth, isAdmin, userController.updateUser);
router.patch('/:id/status', auth, isAdmin, userController.toggleUserStatus);

export default router;
