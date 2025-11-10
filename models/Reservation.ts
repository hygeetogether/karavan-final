// src/models/Reservation.ts

export interface Reservation {
  id: string;
  userId: string; // Guest ID
  caravanId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  totalPrice: number;
}
