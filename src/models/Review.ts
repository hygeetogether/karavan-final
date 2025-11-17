// src/models/Review.ts

export class Review {
  id: string;
  reservationId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  reviewDate: Date;

  constructor(
    id: string,
    reservationId: string,
    reviewerId: string,
    revieweeId: string,
    rating: number,
    comment: string,
    reviewDate: Date,
  ) {
    this.id = id;
    this.reservationId = reservationId;
    this.reviewerId = reviewerId;
    this.revieweeId = revieweeId;
    this.rating = rating;
    this.comment = comment;
    this.reviewDate = reviewDate;
  }
}
