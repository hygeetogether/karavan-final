// src/controllers/PaymentController.ts

import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';
import { BadRequestError } from '../errors/HttpErrors';

export const createPaymentController = (paymentService: PaymentService) => {

  const processPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, reservationId } = req.body;

      if (!userId || !reservationId) {
        throw new BadRequestError('userId and reservationId are required');
      }

      const payment = await paymentService.processPayment(userId, reservationId);

      res.status(201).json({ message: 'Payment processed successfully', payment });
    } catch (error) {
      next(error);
    }
  };

  const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const payments = await paymentService.getPaymentHistory(userId);
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  };

  return { processPayment, getPaymentHistory };
};
