// src/controllers/ReviewController.ts

import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/ReviewService';
import { BadRequestError } from '../errors/HttpErrors';

export const createReviewController = (reviewService: ReviewService) => {

  const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, reservationId, reviewerId, revieweeId, rating, comment } = req.body;

      if (!id || !reservationId || !reviewerId || !revieweeId || rating === undefined || !comment) {
        throw new BadRequestError('Missing required fields for review');
      }

      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new BadRequestError('Rating must be a number between 1 and 5');
      }

      const review = await reviewService.createReview(id, reservationId, reviewerId, revieweeId, rating, comment);

      res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
      next(error);
    }
  };

  return { createReview };
};
