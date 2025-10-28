import { Response } from 'express';
import { param, validationResult } from 'express-validator';
import transactionService from '../services/transaction.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

/**
 * Transaction Controller - handles transaction endpoints
 */
export class TransactionController {
  /**
   * Get all transactions with filters
   * GET /api/transactions
   */
  async getAllTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters: any = {};

      if (req.query.type) {
        filters.type = req.query.type;
      }

      if (req.query.status) {
        filters.status = req.query.status;
      }

      if (req.query.userId) {
        filters.userId = req.query.userId;
      }

      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }

      const result = await transactionService.getAllTransactions(page, limit, filters);

      sendSuccess(res, result, 'Transactions retrieved successfully');
    } catch (error: any) {
      console.error('Get transactions error:', error);
      sendError(res, 'Failed to retrieve transactions', 500);
    }
  }

  /**
   * Get transaction by ID
   * GET /api/transactions/:id
   */
  async getTransactionById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const transaction = await transactionService.getTransactionById(id);

      sendSuccess(res, transaction, 'Transaction retrieved successfully');
    } catch (error: any) {
      console.error('Get transaction error:', error);
      sendError(res, error.message || 'Failed to retrieve transaction', 404);
    }
  }

  /**
   * Get transactions by user ID
   * GET /api/transactions/user/:userId
   */
  async getTransactionsByUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await transactionService.getTransactionsByUser(userId, page, limit);

      sendSuccess(res, result, 'User transactions retrieved successfully');
    } catch (error: any) {
      console.error('Get user transactions error:', error);
      sendError(res, 'Failed to retrieve user transactions', 500);
    }
  }

  /**
   * Get transaction statistics
   * GET /api/transactions/stats
   */
  async getStatistics(req: AuthRequest, res: Response): Promise<void> {
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }

      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      const stats = await transactionService.getStatistics(startDate, endDate);

      sendSuccess(res, stats, 'Transaction statistics retrieved successfully');
    } catch (error: any) {
      console.error('Get transaction stats error:', error);
      sendError(res, 'Failed to retrieve transaction statistics', 500);
    }
  }
}

export default new TransactionController();
