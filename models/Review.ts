// src/models/Review.ts

export interface Review {
  id: string;
  reservationId: string;
  reviewerId: string; // The user who writes the review
  revieweeId: string; // The user (host) or caravan being reviewed
  rating: number; // 1-5
  comment: string;
  reviewDate: Date;
}
