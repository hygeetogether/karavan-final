// src/repositories/PaymentRepository.ts

import { Payment } from '../models/Payment';

export class PaymentRepository {
  private payments: Map<string, Payment> = new Map();

  add(payment: Payment): void {
    this.payments.set(payment.id, payment);
  }

  findById(id: string): Payment | undefined {
    return this.payments.get(id);
  }

  findByReservationId(reservationId: string): Payment[] {
    const results: Payment[] = [];
    for (const payment of this.payments.values()) {
      if (payment.reservationId === reservationId) {
        results.push(payment);
      }
    }
    return results;
  }

  findAll(): Payment[] {
    return Array.from(this.payments.values());
  }
}