// src/repositories/PaymentRepository.ts

import { Payment } from '../models/Payment';

export class PaymentRepository {
  private paymentsById: Map<string, Payment> = new Map();
  private paymentsByReservationId: Map<string, Payment> = new Map();

  public create(payment: Payment): void {
    this.paymentsById.set(payment.id, payment);
    this.paymentsByReservationId.set(payment.reservationId, payment);
  }

  public findById(id: string): Payment | undefined {
    return this.paymentsById.get(id);
  }

  public findByReservationId(reservationId: string): Payment | undefined {
    return this.paymentsByReservationId.get(reservationId);
  }
}
