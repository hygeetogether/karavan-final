// src/routes/ReviewRoutes.ts

import { Router } from 'express';
import { createReviewController } from '../controllers/ReviewController';
import { reviewService } from '../container';

const router = Router();

const reviewController = createReviewController(reviewService);

router.post('/', reviewController.createReview);

export default router;
