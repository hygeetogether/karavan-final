// src/models/Reservation.ts

export class Reservation {
  id: string;
  userId: string;
  caravanId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  totalPrice: number;

  constructor(
    id: string,
    userId: string,
    caravanId: string,
    startDate: Date,
    endDate: Date,
    totalPrice: number,
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' = 'pending',
  ) {
    this.id = id;
    this.userId = userId;
    this.caravanId = caravanId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalPrice = totalPrice;
    this.status = status;
  }

  approve(): void {
    if (this.status === 'pending') {
      this.status = 'approved';
    }
  }

  reject(): void {
    if (this.status === 'pending') {
      this.status = 'rejected';
    }
  }

  complete(): void {
    if (this.status === 'approved') {
      this.status = 'completed';
    }
  }

  cancel(): void {
    if (this.status === 'pending' || this.status === 'approved') {
      this.status = 'cancelled';
    }
  }
}
