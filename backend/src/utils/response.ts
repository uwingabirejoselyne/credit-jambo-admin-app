import { Response } from 'express';

/**
 * Success response structure
 */
interface SuccessResponse {
  success: true;
  message?: string;
  data?: any;
}

/**
 * Error response structure
 */
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

/**
 * Send success response
 */
export const sendSuccess = (
  res: Response,
  data?: any,
  message?: string,
  statusCode: number = 200
): void => {
  const response: SuccessResponse = {
    success: true,
  };

  if (message) response.message = message;
  if (data !== undefined) response.data = data;

  res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: any
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  res.status(statusCode).json(response);
};
