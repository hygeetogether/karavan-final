// src/services/ReservationService.ts

import { Reservation } from '../models/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ReservationValidator } from './ReservationValidator';
import { NotFoundError, BadRequestError } from '../errors/HttpErrors';
import { ReservationConflictError, InsufficientFundsError, InvalidReservationStatusError } from '../errors/DomainErrors';

export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private caravanRepository: CaravanRepository,
    private userRepository: UserRepository,
    private reservationValidator: ReservationValidator
  ) {}

  /**
   * Creates a new reservation.
   * @param id The reservation's ID.
   * @param userId The ID of the user making the reservation.
   * @param caravanId The ID of the caravan being reserved.
   * @param startDate The start date of the reservation.
   * @param endDate The end date of the reservation.
   * @returns The newly created reservation.
   */
  async createReservation(
    id: string,
    userId: string,
    caravanId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Reservation> {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const caravan = this.caravanRepository.findById(caravanId);
    if (!caravan) {
      throw new NotFoundError('Caravan not found');
    }

    if (caravan.status !== 'available') {
      throw new BadRequestError('Caravan is not available for reservation');
    }

    const totalPrice = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) * caravan.dailyRate;
    if ((user.balance || 0) < totalPrice) {
      throw new InsufficientFundsError();
    }

    const newReservation = new Reservation(id, userId, caravanId, startDate, endDate, totalPrice);

    const existingReservations = this.reservationRepository.findByCaravanId(caravanId);
    if (this.reservationValidator.hasOverlap(newReservation, existingReservations)) {
      throw new ReservationConflictError();
    }

    user.updateBalance(-totalPrice);
    caravan.updateStatus('reserved');
    this.reservationRepository.add(newReservation);

    return newReservation;
  }

  /**
   * Gets a reservation by its ID.
   * @param id The ID of the reservation to retrieve.
   * @returns The reservation if found.
   * @throws NotFoundError if the reservation is not found.
   */
  async getReservationById(id: string): Promise<Reservation> {
    const reservation = this.reservationRepository.findById(id);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }
    return reservation;
  }

  async approveReservation(id: string, hostId: string): Promise<Reservation> {
    const reservation = this.getReservationById(id);
    const caravan = this.caravanRepository.findById((await reservation).caravanId);
    if (!caravan || caravan.hostId !== hostId) {
        throw new BadRequestError('Only the host can approve the reservation');
    }
    (await reservation).approve();
    return reservation;
  }

  async rejectReservation(id: string, hostId: string): Promise<Reservation> {
    const reservation = this.getReservationById(id);
    const caravan = this.caravanRepository.findById((await reservation).caravanId);
    if (!caravan || caravan.hostId !== hostId) {
        throw new BadRequestError('Only the host can reject the reservation');
    }
    (await reservation).reject();
    return reservation;
  }

  async completeReservation(id: string): Promise<Reservation> {
    const reservation = this.getReservationById(id);
    (await reservation).complete();
    return reservation;
  }
}