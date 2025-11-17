// src/repositories/ReviewRepository.ts

import { Review } from '../models/Review';

export class ReviewRepository {
  private reviews: Map<string, Review> = new Map();

  add(review: Review): void {
    this.reviews.set(review.id, review);
  }

  findById(id: string): Review | undefined {
    return this.reviews.get(id);
  }

  findByReservationId(reservationId: string): Review | undefined {
    for (const review of this.reviews.values()) {
      if (review.reservationId === reservationId) {
        return review;
      }
    }
    return undefined;
  }

  findAll(): Review[] {
    return Array.from(this.reviews.values());
  }
}