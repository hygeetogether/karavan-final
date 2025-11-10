// src/models/Payment.ts

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed';
}
