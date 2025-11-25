import { Request, Response } from 'express';
import { ReservationService } from '../services/ReservationService';
import { Reservation } from '../models/Reservation';

export class ReservationController {
  constructor(private service: ReservationService) { }

  // POST /api/reservations
  createReservation = async (req: Request, res: Response) => {
    try {
      // In a real app, we would use a DTO and validation middleware here.
      // For now, we cast the body to Reservation (or partial) and let the service handle domain validation.
      // We need to ensure dates are Date objects if they come as strings.
      const reservationData = {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'PENDING'
      } as Reservation;

      const reservation = await this.service.create(reservationData);
      res.status(201).json(reservation);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  };

  // PATCH /api/reservations/:id/status
  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
      }

      const updated = await this.service.updateStatus(Number(id), status);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  };

  // GET /api/reservations?userId=:userId
  getUserReservations = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        res.status(400).json({ error: 'UserId query param is required' });
        return;
      }

      const reservations = await this.service.getByUserId(Number(userId));
      res.json(reservations);
    } catch (e) {
      res.status(400).json({ error: (e as Error).message });
    }
  };
}
