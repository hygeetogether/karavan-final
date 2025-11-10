// src/repositories/ReviewRepository.ts

import { Review } from '../models/Review';

export class ReviewRepository {
  private reviewsById: Map<string, Review> = new Map();

  public create(review: Review): void {
    this.reviewsById.set(review.id, review);
  }

  public findById(id: string): Review | undefined {
    return this.reviewsById.get(id);
  }

  public findByReservationId(reservationId: string): Review[] {
    const results: Review[] = [];
    for (const review of this.reviewsById.values()) {
      if (review.reservationId === reservationId) {
        results.push(review);
      }
    }
    return results;
  }
}
