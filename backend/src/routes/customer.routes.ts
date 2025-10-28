import { Router } from 'express';
import customerController from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management endpoints
 */

/**
 * @swagger
 * /customers/pending-verifications:
 *   get:
 *     summary: Get customers with pending device verifications
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending verifications retrieved successfully
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
 *                   example: Pending verifications retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       deviceInfo:
 *                         type: string
 *                       verificationStatus:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/pending-verifications', customerController.getPendingVerifications.bind(customerController));

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers with pagination
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
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
 *                   example: Customers retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     customers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           active:
 *                             type: boolean
 *                           verificationStatus:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 *                         total:
 *                           type: number
 *                         pages:
 *                           number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', customerController.getAllCustomers.bind(customerController));

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
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
 *                   example: Customer retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     active:
 *                       type: boolean
 *                     verificationStatus:
 *                       type: string
 *                     deviceInfo:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get('/:id', customerController.getCustomerById.bind(customerController));

/**
 * @swagger
 * /customers/{id}/verify-device:
 *   post:
 *     summary: Verify customer device
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Device verified successfully
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
 *                   example: Device verified successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/verify-device',
  customerController.verifyDeviceValidation,
  customerController.verifyDevice.bind(customerController)
);

/**
 * @swagger
 * /customers/{id}/reject-device:
 *   post:
 *     summary: Reject customer device
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Device rejected successfully
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
 *                   example: Device rejected successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.post(
  '/:id/reject-device',
  customerController.rejectDeviceValidation,
  customerController.rejectDevice.bind(customerController)
);

/**
 * @swagger
 * /customers/{id}/toggle-status:
 *   patch:
 *     summary: Toggle customer active status
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer status toggled successfully
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
 *                   example: Customer status toggled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/toggle-status', customerController.toggleStatus.bind(customerController));

export default router;
