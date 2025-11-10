// src/services/ReservationService.ts

import { Reservation } from '../models/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ReservationValidator } from './ReservationValidator';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../errors/HttpErrors';

export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private caravanRepository: CaravanRepository,
    private userRepository: UserRepository,
    private reservationValidator: ReservationValidator
  ) {}

  public async createReservation(
    userId: string,
    caravanId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Reservation> {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    const caravan = this.caravanRepository.findById(caravanId);
    if (!caravan) {
      throw new NotFoundError(`Caravan with ID ${caravanId} not found`);
    }
    
    if (caravan.status !== 'available') {
        throw new BadRequestError(`Caravan with ID ${caravanId} is not available for reservation`);
    }

    const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    if (days <= 0) {
        throw new BadRequestError('End date must be after start date');
    }
    const totalPrice = days * caravan.dailyRate;

    const newReservation: Reservation = {
      id: uuidv4(),
      userId,
      caravanId,
      startDate,
      endDate,
      status: 'pending', // Host needs to approve
      totalPrice,
    };

    const existingReservations = this.reservationRepository.findByCaravanId(caravanId);
    if (!this.reservationValidator.validate(newReservation, existingReservations)) {
        throw new BadRequestError('Reservation validation failed. Please check the dates.');
    }

    this.reservationRepository.create(newReservation);
    
    // In a real app, you might also trigger a payment process or send a notification (Observer Pattern)
    
    return newReservation;
  }

  public async approveReservation(reservationId: string, hostId: string): Promise<Reservation> {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError(`Reservation with ID ${reservationId} not found`);
    }

    const caravan = this.caravanRepository.findById(reservation.caravanId);
    if (!caravan) {
      // This would indicate data inconsistency
      throw new NotFoundError(`Caravan with ID ${reservation.caravanId} not found`);
    }

    if (caravan.hostId !== hostId) {
      throw new UnauthorizedError('You are not authorized to approve this reservation');
    }

    if (reservation.status !== 'pending') {
      throw new BadRequestError('Only pending reservations can be approved');
    }

    reservation.status = 'approved';
    // In a real DB, you would save the updated reservation.
    // The in-memory object is updated by reference here.

    return reservation;
  }

  public async rejectReservation(reservationId: string, hostId: string): Promise<Reservation> {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError(`Reservation with ID ${reservationId} not found`);
    }

    const caravan = this.caravanRepository.findById(reservation.caravanId);
    if (!caravan) {
      throw new NotFoundError(`Caravan with ID ${reservation.caravanId} not found`);
    }

    if (caravan.hostId !== hostId) {
      throw new UnauthorizedError('You are not authorized to reject this reservation');
    }

    if (reservation.status !== 'pending') {
      throw new BadRequestError('Only pending reservations can be rejected');
    }

    reservation.status = 'rejected';
    return reservation;
  }

  public async completeReservation(reservationId: string): Promise<Reservation> {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError(`Reservation with ID ${reservationId} not found`);
    }

    if (reservation.status !== 'approved') {
      throw new BadRequestError('Only approved reservations can be completed');
    }

    // In a real app, you would also check if the reservation end date has passed.

    reservation.status = 'completed';
    return reservation;
  }
}
