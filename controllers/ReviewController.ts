// src/controllers/ReviewController.ts

import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/ReviewService';
import { BadRequestError } from '../errors/HttpErrors';

export const createReviewController = (reviewService: ReviewService) => {

  const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reservationId, reviewerId, rating, comment } = req.body;

      if (!reservationId || !reviewerId || rating === undefined || !comment) {
        throw new BadRequestError('Missing required fields for review');
      }

      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new BadRequestError('Rating must be a number between 1 and 5');
      }

      const review = await reviewService.createReview(reservationId, reviewerId, rating, comment);

      res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
      next(error);
    }
  };

  return { createReview };
};
