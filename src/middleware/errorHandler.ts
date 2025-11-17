// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Log the error for debugging purposes
  console.error(err);

  // For unexpected errors, send a generic 500 response
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'An unexpected error occurred',
  });
};
