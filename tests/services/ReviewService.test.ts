// tests/services/ReviewService.test.ts

import { ReviewService } from '../../src/services/ReviewService';
import { ReviewRepository } from '../../src/repositories/ReviewRepository';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { CaravanRepository } from '../../src/repositories/CaravanRepository';
import { Reservation } from '../../src/models/Reservation';

jest.mock('../../src/repositories/ReviewRepository');
jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/repositories/CaravanRepository');
jest.mock('../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    review: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    reservation: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    caravan: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let mockReviewRepo: jest.Mocked<ReviewRepository>;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;

  beforeEach(() => {
    mockReviewRepo = new ReviewRepository() as jest.Mocked<ReviewRepository>;
    mockReservationRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockCaravanRepo = new CaravanRepository() as jest.Mocked<CaravanRepository>;

    reviewService = new ReviewService(
      mockReviewRepo,
      mockReservationRepo,
      mockUserRepo,
      mockCaravanRepo
    );
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      const reservation: Reservation = {
        id: 1,
        userId: 1,
        caravanId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'APPROVED',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReservationRepo.findById.mockReturnValue(Promise.resolve(reservation));
      mockReviewRepo.add.mockReturnValue(Promise.resolve());

      const review = await reviewService.create(1, 1, 5, 'Great!');

      expect(review).toBeDefined();
      expect(review.rating).toBe(5);
      expect(mockReviewRepo.add).toHaveBeenCalled();
    });

    it('should throw error if reservation not found', async () => {
      mockReservationRepo.findById.mockReturnValue(Promise.resolve(undefined));

      await expect(reviewService.create(1, 1, 5, 'Great!')).rejects.toThrow('Reservation not found');
    });
  });
});
