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
  ) { }

  async create(
    reservationId: number,
    reviewerId: number,
    rating: number,
    comment: string
  ): Promise<Review> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    // Check if reservation is completed (assuming 'APPROVED' or 'COMPLETED' status logic)
    // For MVP, let's say only APPROVED can be reviewed or we need a COMPLETED status.
    if (reservation.status !== 'APPROVED') {
      throw new BadRequestError('Can only review approved reservations');
    }

    if (reservation.userId !== reviewerId) {
      throw new BadRequestError('Only the guest can write a review');
    }

    const review: Review = {
      id: 0, // Placeholder for Prisma
      reservationId,
      reviewerId,
      revieweeId: reservation.caravanId, // Reviewing the caravan/host
      rating,
      comment,
      reviewDate: new Date()
    };

    await this.reviewRepository.add(review);

    // Update host rating
    const caravan = await this.caravanRepository.findById(reservation.caravanId);
    if (caravan) {
      const host = await this.userRepository.findById(caravan.ownerId);
      if (host) {
        // In a real app, we would calculate the average from all reviews.
        // For MVP, we'll just update it to the new rating or a simple average if we had previous count.
        // Let's just set it to the new rating for simplicity or maybe (old + new) / 2 if old exists.
        const newRating = host.rating ? (host.rating + rating) / 2 : rating;
        await this.userRepository.update(host.id, { rating: newRating });
      }
    }

    return review;
  }

  async getById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundError('Review not found');
    }
    return review;
  }

  async getByCaravanId(caravanId: number): Promise<Review[]> {
    return this.reviewRepository.findByCaravanId(caravanId);
  }
}