// src/routes/PaymentRoutes.ts

import { Router } from 'express';
import { createPaymentController } from '../controllers/PaymentController';
import { paymentService } from '../container';

const router = Router();

const paymentController = createPaymentController(paymentService);

router.post('/', paymentController.processPayment);
router.get('/history/:userId', paymentController.getPaymentHistory);

export default router;
