import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics endpoints
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCustomers:
 *                       type: number
 *                     totalTransactions:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     pendingVerifications:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/stats', dashboardController.getStatistics.bind(dashboardController));

/**
 * @swagger
 * /dashboard/recent-activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Recent activities retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       description:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/recent-activities', dashboardController.getRecentActivities.bind(dashboardController));

export default router;
