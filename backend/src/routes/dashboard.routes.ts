import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', dashboardController.getStatistics.bind(dashboardController));

/**
 * @route   GET /api/dashboard/recent-activities
 * @desc    Get recent activities
 * @access  Private
 */
router.get('/recent-activities', dashboardController.getRecentActivities.bind(dashboardController));

export default router;
