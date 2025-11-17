// src/services/PaymentService.ts

import { Payment } from '../models/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { ReservationService } from './ReservationService';
import { NotFoundError, BadRequestError } from '../errors/HttpErrors';

export class PaymentService {
  constructor(
    private userRepository: UserRepository,
    private reservationRepository: ReservationRepository,
    private paymentRepository: PaymentRepository,
    private caravanRepository: CaravanRepository,
    private reservationService: ReservationService
  ) {}

  /**
   * Creates a new payment for a reservation.
   * @param id The payment's ID.
   * @param reservationId The ID of the reservation.
   * @returns The newly created payment.
   */
  async createPayment(id: string, reservationId: string): Promise<Payment> {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    const user = this.userRepository.findById(reservation.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const payment = new Payment(id, reservationId, reservation.totalPrice, new Date());
    payment.complete();
    this.paymentRepository.add(payment);

    return payment;
  }

  /**
   * Gets a payment by its ID.
   * @param id The ID of the payment to retrieve.
   * @returns The payment if found.
   * @throws NotFoundError if the payment is not found.
   */
  async getPaymentById(id: string): Promise<Payment> {
    const payment = this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    return payment;
  }

  /**
   * Gets the payment history for a user.
   * @param userId The ID of the user.
   * @returns A list of payments for the user.
   */
  async getPaymentHistory(userId: string): Promise<Payment[]> {
    const reservations = this.reservationRepository.findAll().filter(r => r.userId === userId);
    const reservationIds = reservations.map(r => r.id);
    return this.paymentRepository.findAll().filter(p => reservationIds.includes(p.reservationId));
  }
}