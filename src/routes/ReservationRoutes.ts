// src/routes/ReservationRoutes.ts

import { Router } from 'express';
import { createReservationController } from '../controllers/ReservationController';
import { reservationService } from '../container';

const router = Router();

const reservationController = createReservationController(reservationService);

router.post('/', reservationController.createReservation);
router.patch('/:id/approve', reservationController.approveReservation);
router.patch('/:id/reject', reservationController.rejectReservation);
router.patch('/:id/complete', reservationController.completeReservation);

export default router;
