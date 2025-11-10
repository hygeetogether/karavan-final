// src/controllers/ReservationController.ts

import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/ReservationService';
import { BadRequestError } from '../errors/HttpErrors';

export const createReservationController = (reservationService: ReservationService) => {

  const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, caravanId, startDate, endDate } = req.body;

      if (!userId || !caravanId || !startDate || !endDate) {
        throw new BadRequestError('Missing required fields for reservation');
      }

      // Dates from JSON will be strings, so they need to be converted
      const reservation = await reservationService.createReservation(
        userId,
        caravanId,
        new Date(startDate),
        new Date(endDate)
      );

      res.status(201).json({ message: 'Reservation created successfully and is pending approval', reservation });
    } catch (error) {
      next(error);
    }
  };

  const approveReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { hostId } = req.body;

      if (!hostId) {
        throw new BadRequestError('hostId is required to approve a reservation');
      }

      const reservation = await reservationService.approveReservation(id, hostId);
      res.status(200).json({ message: 'Reservation approved successfully', reservation });
    } catch (error) {
      next(error);
    }
  };

  const rejectReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { hostId } = req.body;

      if (!hostId) {
        throw new BadRequestError('hostId is required to reject a reservation');
      }

      const reservation = await reservationService.rejectReservation(id, hostId);
      res.status(200).json({ message: 'Reservation rejected successfully', reservation });
    } catch (error) {
      next(error);
    }
  };

  const completeReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const reservation = await reservationService.completeReservation(id);
      res.status(200).json({ message: 'Reservation completed successfully', reservation });
    } catch (error) {
      next(error);
    }
  };

  return { createReservation, approveReservation, rejectReservation, completeReservation };
};
