// src/services/PaymentService.ts

import { UserRepository } from '../repositories/UserRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { ReservationService } from './ReservationService';
import { Payment } from '../models/Payment';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, BadRequestError } from '../errors/HttpErrors';

export class PaymentService {
  constructor(
    private userRepository: UserRepository,
    private reservationRepository: ReservationRepository,
    private paymentRepository: PaymentRepository,
    private caravanRepository: CaravanRepository,
    private reservationService: ReservationService
  ) {}

  public async processPayment(userId: string, reservationId: string): Promise<Payment> {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }

    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError(`Reservation with ID ${reservationId} not found`);
    }

    if (reservation.userId !== userId) {
        throw new BadRequestError(`User ${userId} is not the owner of reservation ${reservationId}`);
    }

    if (reservation.status !== 'pending') {
      throw new BadRequestError('Payment can only be processed for pending reservations');
    }

    const userBalance = user.balance || 0;
    if (userBalance < reservation.totalPrice) {
      throw new BadRequestError('Insufficient balance');
    }

    const caravan = this.caravanRepository.findById(reservation.caravanId);
    if (!caravan) {
        throw new NotFoundError(`Caravan with ID ${reservation.caravanId} not found`);
    }

    // Deduct balance and create payment record
    user.balance = userBalance - reservation.totalPrice;
    
    const newPayment: Payment = {
      id: uuidv4(),
      reservationId,
      amount: reservation.totalPrice,
      paymentDate: new Date(),
      status: 'completed',
    };
    this.paymentRepository.create(newPayment);

    // After successful payment, approve the reservation
    // The payment acts as the approval, using the actual host's ID.
    await this.reservationService.approveReservation(reservationId, caravan.hostId);
    
    return newPayment;
  }

  public async getPaymentHistory(userId: string): Promise<Payment[]> {
    const userReservations = this.reservationRepository.findByUserId(userId);
    const payments: Payment[] = [];
    for (const reservation of userReservations) {
      const payment = this.paymentRepository.findByReservationId(reservation.id);
      if (payment) {
        payments.push(payment);
      }
    }
    return payments;
  }
}
