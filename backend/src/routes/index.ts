import { Router } from 'express';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import transactionRoutes from './transaction.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
