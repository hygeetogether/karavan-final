// src/services/ReviewService.ts

import { Review } from '../models/Review';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { NotFoundError, BadRequestError } from '../errors/HttpErrors';

export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private reservationRepository: ReservationRepository,
    private userRepository: UserRepository,
    private caravanRepository: CaravanRepository
  ) {}

  /**
   * Creates a new review for a completed reservation.
   * @param id The review's ID.
   * @param reservationId The ID of the reservation.
   * @param reviewerId The ID of the user writing the review.
   * @param revieweeId The ID of the user or caravan being reviewed.
   * @param rating The rating from 1 to 5.
   * @param comment The review comment.
   * @returns The newly created review.
   */
  async createReview(
    id: string,
    reservationId: string,
    reviewerId: string,
    revieweeId: string,
    rating: number,
    comment: string
  ): Promise<Review> {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (reservation.status !== 'completed') {
      throw new BadRequestError('Can only review completed reservations');
    }

    if (reservation.userId !== reviewerId) {
      throw new BadRequestError('Only the user who made the reservation can write a review');
    }

    const review = new Review(id, reservationId, reviewerId, revieweeId, rating, comment, new Date());
    this.reviewRepository.add(review);

    // Update the rating of the host or caravan
    const caravan = this.caravanRepository.findById(reservation.caravanId);
    if (caravan) {
        const host = this.userRepository.findById(caravan.hostId);
        if (host) {
            // In a real application, you would calculate the average rating
            host.rating = rating;
        }
    }


    return review;
  }

  /**
   * Gets a review by its ID.
   * @param id The ID of the review to retrieve.
   * @returns The review if found.
   * @throws NotFoundError if the review is not found.
   */
  async getReviewById(id: string): Promise<Review> {
    const review = this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    return review;
  }
}