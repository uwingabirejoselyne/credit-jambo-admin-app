import { Router } from 'express';
import customerController from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/customers/pending-verifications
 * @desc    Get customers with pending device verifications
 * @access  Private
 */
router.get('/pending-verifications', customerController.getPendingVerifications.bind(customerController));

/**
 * @route   GET /api/customers
 * @desc    Get all customers with pagination
 * @access  Private
 */
router.get('/', customerController.getAllCustomers.bind(customerController));

/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Private
 */
router.get('/:id', customerController.getCustomerById.bind(customerController));

/**
 * @route   POST /api/customers/:id/verify-device
 * @desc    Verify customer device
 * @access  Private
 */
router.post(
  '/:id/verify-device',
  customerController.verifyDeviceValidation,
  customerController.verifyDevice.bind(customerController)
);

/**
 * @route   POST /api/customers/:id/reject-device
 * @desc    Reject customer device
 * @access  Private
 */
router.post(
  '/:id/reject-device',
  customerController.rejectDeviceValidation,
  customerController.rejectDevice.bind(customerController)
);

/**
 * @route   PATCH /api/customers/:id/toggle-status
 * @desc    Toggle customer active status
 * @access  Private
 */
router.patch('/:id/toggle-status', customerController.toggleStatus.bind(customerController));

export default router;
