import prisma from '../lib/prisma';
import { Review } from '../models/Review';

export class ReviewRepository {
  async add(review: Review): Promise<void> {
    await prisma.review.create({
      data: {
        id: review.id,
        reservationId: review.reservationId,
        reviewerId: review.reviewerId,
        revieweeId: review.revieweeId,
        rating: review.rating,
        comment: review.comment,
        reviewDate: review.reviewDate
      }
    });
  }

  async findById(id: number): Promise<Review | undefined> {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return undefined;
    return review;
  }

  async findByCaravanId(caravanId: number): Promise<Review[]> {
    // Review is linked to Reservation, which is linked to Caravan.
    // We need to join.
    const reviews = await prisma.review.findMany({
      where: {
        reservation: {
          caravanId: caravanId
        }
      }
    });
    return reviews;
  }
}