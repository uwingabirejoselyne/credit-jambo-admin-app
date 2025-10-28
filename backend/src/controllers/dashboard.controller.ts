import { Response } from 'express';
import dashboardService from '../services/dashboard.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

/**
 * Dashboard Controller - handles dashboard endpoints
 */
export class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/dashboard/stats
   */
  async getStatistics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getStatistics();

      sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      sendError(res, 'Failed to retrieve dashboard statistics', 500);
    }
  }

  /**
   * Get recent activities
   * GET /api/dashboard/recent-activities
   */
  async getRecentActivities(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const activities = await dashboardService.getRecentActivities(limit);

      sendSuccess(res, activities, 'Recent activities retrieved successfully');
    } catch (error: any) {
      console.error('Get recent activities error:', error);
      sendError(res, 'Failed to retrieve recent activities', 500);
    }
  }
}

export default new DashboardController();
