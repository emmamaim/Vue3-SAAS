import express from 'express';
import * as deptController from '../controllers/deptController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 獲取選項（無需認證）
router.get('/options', auth, deptController.getDeptOptions);

// 管理員專用路由（需要認證和管理員權限）
router.get('/', auth, isAdmin, deptController.getDepartments);
router.post('/', auth, isAdmin, deptController.createDepartment);
router.put('/:id', auth, isAdmin, deptController.updateDepartment);
router.delete('/:id', auth, isAdmin, deptController.deleteDepartment);

export default router;
