import express from 'express';
const router = express.Router();
import * as dashboardController from '../controllers/dashboardController.js';
import {
  auth,
  isAdmin,
  isHr,
  isInterviewer
} from '../middleware/authMiddleware.js';

router.use(auth);

router.get('/admin', isAdmin, dashboardController.getAdminDashboard);
router.get('/hr', isHr, dashboardController.getHrDashboard);
router.get(
  '/interviewer',
  isInterviewer,
  dashboardController.getInterviewerDashboard
);

export default router;
