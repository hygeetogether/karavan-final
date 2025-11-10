// src/services/ReviewService.ts

import { Review } from '../models/Review';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../errors/HttpErrors';

export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private reservationRepository: ReservationRepository,
    private userRepository: UserRepository,
    private caravanRepository: CaravanRepository
  ) {}

  public async createReview(
    reservationId: string,
    reviewerId: string,
    rating: number,
    comment: string
  ): Promise<Review> {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError(`Reservation with ID ${reservationId} not found`);
    }

    if (reservation.status !== 'completed') {
      throw new BadRequestError('Reviews can only be left for completed reservations');
    }

    const reviewer = this.userRepository.findById(reviewerId);
    if (!reviewer) {
      throw new NotFoundError(`Reviewer with ID ${reviewerId} not found`);
    }

    // Ensure the reviewer was part of the reservation (either guest or host)
    // For now, we'll assume only the guest (userId on reservation) can write a review.
    if (reservation.userId !== reviewerId) {
      throw new UnauthorizedError(`User ${reviewerId} is not authorized to review this reservation`);
    }
    
    // Prevent duplicate reviews
    const existingReviews = this.reviewRepository.findByReservationId(reservationId);
    if (existingReviews.some(r => r.reviewerId === reviewerId)) {
        throw new BadRequestError('You have already reviewed this reservation');
    }

    const caravan = this.caravanRepository.findById(reservation.caravanId);
    if (!caravan) {
        throw new NotFoundError(`Caravan with ID ${reservation.caravanId} not found`);
    }

    const newReview: Review = {
      id: uuidv4(),
      reservationId,
      reviewerId,
      revieweeId: caravan.hostId, // The review is for the host
      rating,
      comment,
      reviewDate: new Date(),
    };

    this.reviewRepository.create(newReview);

    // Update the host's average rating
    const host = this.userRepository.findById(caravan.hostId);
    if (host) {
        // In a real app, this would be a more complex calculation (e.g., averaging all ratings)
        host.rating = rating;
    }

    return newReview;
  }
}
