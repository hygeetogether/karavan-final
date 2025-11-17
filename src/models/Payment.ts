// src/models/Payment.ts

export class Payment {
  id: string;
  reservationId: string;
  amount: number;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed';

  constructor(
    id: string,
    reservationId: string,
    amount: number,
    paymentDate: Date,
    status: 'pending' | 'completed' | 'failed' = 'pending',
  ) {
    this.id = id;
    this.reservationId = reservationId;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.status = status;
  }

  complete(): void {
    if (this.status === 'pending') {
      this.status = 'completed';
    }
  }

  fail(): void {
    if (this.status === 'pending') {
      this.status = 'failed';
    }
  }
}
