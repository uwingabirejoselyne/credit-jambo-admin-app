import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/transactions/stats
 * @desc    Get transaction statistics
 * @access  Private
 */
router.get('/stats', transactionController.getStatistics.bind(transactionController));

/**
 * @route   GET /api/transactions/user/:userId
 * @desc    Get transactions by user ID
 * @access  Private
 */
router.get('/user/:userId', transactionController.getTransactionsByUser.bind(transactionController));

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filters
 * @access  Private
 */
router.get('/', transactionController.getAllTransactions.bind(transactionController));

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get('/:id', transactionController.getTransactionById.bind(transactionController));

export default router;
