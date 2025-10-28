import { Response } from 'express';
import { query, param, body, validationResult } from 'express-validator';
import customerService from '../services/customer.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth';

/**
 * Customer Controller - handles customer management endpoints
 */
export class CustomerController {
  /**
   * Get all customers
   * GET /api/customers
   */
  async getAllCustomers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await customerService.getAllCustomers(page, limit, search);

      sendSuccess(res, result, 'Customers retrieved successfully');
    } catch (error: any) {
      console.error('Get customers error:', error);
      sendError(res, 'Failed to retrieve customers', 500);
    }
  }

  /**
   * Get customer by ID
   * GET /api/customers/:id
   */
  async getCustomerById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const customer = await customerService.getCustomerById(id);

      sendSuccess(res, customer, 'Customer retrieved successfully');
    } catch (error: any) {
      console.error('Get customer error:', error);
      sendError(res, error.message || 'Failed to retrieve customer', 404);
    }
  }

  /**
   * Get customers with pending device verifications
   * GET /api/customers/pending-verifications
   */
  async getPendingVerifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const customers = await customerService.getPendingVerifications();

      sendSuccess(res, customers, 'Pending verifications retrieved successfully');
    } catch (error: any) {
      console.error('Get pending verifications error:', error);
      sendError(res, 'Failed to retrieve pending verifications', 500);
    }
  }

  /**
   * Verify customer device
   * POST /api/customers/:id/verify-device
   */
  async verifyDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation failed', 400, errors.array());
        return;
      }

      const { id } = req.params;
      const { deviceIdHash } = req.body;

      if (!req.admin) {
        sendError(res, 'Not authenticated', 401);
        return;
      }

      const customer = await customerService.verifyDevice(id, deviceIdHash, req.admin.id);

      sendSuccess(res, customer, 'Device verified successfully');
    } catch (error: any) {
      console.error('Verify device error:', error);
      sendError(res, error.message || 'Failed to verify device', 400);
    }
  }

  /**
   * Reject customer device
   * POST /api/customers/:id/reject-device
   */
  async rejectDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(res, 'Validation failed', 400, errors.array());
        return;
      }

      const { id } = req.params;
      const { deviceIdHash, reason } = req.body;

      if (!req.admin) {
        sendError(res, 'Not authenticated', 401);
        return;
      }

      const customer = await customerService.rejectDevice(id, deviceIdHash, req.admin.id, reason);

      sendSuccess(res, customer, 'Device rejected successfully');
    } catch (error: any) {
      console.error('Reject device error:', error);
      sendError(res, error.message || 'Failed to reject device', 400);
    }
  }

  /**
   * Toggle customer active status
   * PATCH /api/customers/:id/toggle-status
   */
  async toggleStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const customer = await customerService.toggleCustomerStatus(id);

      sendSuccess(res, customer, 'Customer status updated successfully');
    } catch (error: any) {
      console.error('Toggle status error:', error);
      sendError(res, error.message || 'Failed to update customer status', 400);
    }
  }

  /**
   * Validation rules
   */
  verifyDeviceValidation = [
    param('id').isMongoId().withMessage('Invalid customer ID'),
    body('deviceIdHash').notEmpty().withMessage('Device ID Hash is required'),
  ];

  rejectDeviceValidation = [
    param('id').isMongoId().withMessage('Invalid customer ID'),
    body('deviceIdHash').notEmpty().withMessage('Device ID Hash is required'),
    body('reason').optional().isString().withMessage('Reason must be a string'),
  ];
}

export default new CustomerController();
