import { Payment } from '../models/Payment';
import { ReservationStatus } from '../models/Reservation';
import { PaymentRepository } from '../repositories/PaymentRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError } from '../errors/HttpErrors';

export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private reservationRepository: ReservationRepository,
    private userRepository: UserRepository
  ) { }

  async create(reservationId: number, amount: number): Promise<Payment> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    const user = await this.userRepository.findById(reservation.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const payment: Payment = {
      id: 0,
      reservationId,
      userId: reservation.userId,
      amount,
      paymentDate: new Date(),
      status: 'COMPLETED'
    };

    await this.paymentRepository.add(payment);

    // Update reservation status to CONFIRMED
    await this.reservationRepository.updateStatus(reservationId, ReservationStatus.APPROVED);

    return payment;
  }

  async getById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError('Payment not found');
    }
    return payment;
  }

  async getHistory(userId: number): Promise<Payment[]> {
    return await this.paymentRepository.findByUserId(userId);
  }
}