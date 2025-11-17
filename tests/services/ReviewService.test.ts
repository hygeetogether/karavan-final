// tests/services/ReviewService.test.ts

import { ReviewService } from '../../src/services/ReviewService';
import { ReviewRepository } from '../../src/repositories/ReviewRepository';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { CaravanRepository } from '../../src/repositories/CaravanRepository';
import { User } from '../../src/models/User';
import { Caravan } from '../../src/models/Caravan';
import { Reservation } from '../../src/models/Reservation';
import { NotFoundError, BadRequestError } from '../../src/errors/HttpErrors';

jest.mock('../../src/repositories/ReviewRepository');
jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/repositories/CaravanRepository');

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let mockReviewRepo: jest.Mocked<ReviewRepository>;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;

  const testUser = new User('user1', 'test', 'test@test.com', 'guest', 'Test User', '123', 'pass');
  const testHost = new User('host1', 'host', 'host@test.com', 'host', 'Host', '456', 'pass');
  const testCaravan = new Caravan('caravan1', 'host1', 'Test Caravan', 4, [], [], { latitude: 0, longitude: 0 }, 100);
  const completedReservation = new Reservation('res1', 'user1', 'caravan1', new Date(), new Date(), 100, 'completed');

  beforeEach(() => {
    mockReviewRepo = new ReviewRepository() as jest.Mocked<ReviewRepository>;
    mockReservationRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockCaravanRepo = new CaravanRepository() as jest.Mocked<CaravanRepository>;

    reviewService = new ReviewService(mockReviewRepo, mockReservationRepo, mockUserRepo, mockCaravanRepo);
  });

  describe('createReview', () => {
    it('should create a review successfully', async () => {
      mockReservationRepo.findById.mockReturnValue(completedReservation);
      mockUserRepo.findById.mockReturnValue(testUser);
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      const review = await reviewService.createReview('rev1', 'res1', 'user1', 'host1', 5, 'Great trip!');

      expect(review).toBeDefined();
      expect(review.rating).toBe(5);
      expect(review.comment).toBe('Great trip!');
      expect(mockReviewRepo.add).toHaveBeenCalledWith(review);
    });

    it('should update the host rating after a review is created', async () => {
        const host = new User('host1', 'host', 'host@test.com', 'host', 'Host', '456', 'pass');
        mockReservationRepo.findById.mockReturnValue(completedReservation);
        mockUserRepo.findById.mockReturnValueOnce(testUser).mockReturnValueOnce(host);
        mockCaravanRepo.findById.mockReturnValue(testCaravan);

        await reviewService.createReview('rev1', 'res1', 'user1', 'host1', 4, 'Good caravan');

        expect(mockUserRepo.findById).toHaveBeenCalledWith('host1');
        expect(host.rating).toBe(4);
      });

    it('should throw BadRequestError if reservation is not completed', async () => {
      const pendingReservation = new Reservation('res1', 'user1', 'caravan1', new Date(), new Date(), 100, 'pending');
      mockReservationRepo.findById.mockReturnValue(pendingReservation);
      mockUserRepo.findById.mockReturnValue(testUser);

      await expect(reviewService.createReview('rev1', 'res1', 'user1', 'host1', 5, 'comment')).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if reviewer is not the user on the reservation', async () => {
      mockReservationRepo.findById.mockReturnValue(completedReservation);
      const wrongUser = new User('user2', 'test2', 'test2@test.com', 'guest', 'Test User 2', '123', 'pass');
      mockUserRepo.findById.mockReturnValue(wrongUser);

      await expect(reviewService.createReview('rev1', 'res1', 'user2', 'host1', 5, 'comment')).rejects.toThrow(BadRequestError);
    });
  });
});
