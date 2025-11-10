// tests/services/ReviewService.test.ts

import { ReviewService } from '../../services/ReviewService';
import { ReviewRepository } from '../../repositories/ReviewRepository';
import { ReservationRepository } from '../../repositories/ReservationRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { CaravanRepository } from '../../repositories/CaravanRepository';
import { User } from '../../models/User';
import { Caravan } from '../../models/Caravan';
import { Reservation } from '../../models/Reservation';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../../errors/HttpErrors';

jest.mock('../../repositories/ReviewRepository');
jest.mock('../../repositories/ReservationRepository');
jest.mock('../../repositories/UserRepository');
jest.mock('../../repositories/CaravanRepository');

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let mockReviewRepo: jest.Mocked<ReviewRepository>;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;

  const testUser: User = { id: 'user1', role: 'guest', username: 'test', email: '', password: '', name: '', contact: '', rating: 0, identityVerified: true };
  const testHost: User = { id: 'host1', role: 'host', username: 'host', email: '', password: '', name: 'Host', contact: '', rating: 0, identityVerified: true };
  const testCaravan: Caravan = { id: 'caravan1', hostId: 'host1', name: 'Test Caravan', capacity: 4, amenities: [], photos: [], location: { latitude: 0, longitude: 0 }, status: 'available', dailyRate: 100 };
  const completedReservation: Reservation = { id: 'res1', userId: 'user1', caravanId: 'caravan1', startDate: new Date(), endDate: new Date(), status: 'completed', totalPrice: 100 };

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
      mockReviewRepo.findByReservationId.mockReturnValue([]);

      const review = await reviewService.createReview('res1', 'user1', 5, 'Great trip!');

      expect(review).toBeDefined();
      expect(review.rating).toBe(5);
      expect(review.comment).toBe('Great trip!');
      expect(mockReviewRepo.create).toHaveBeenCalledWith(review);
    });

    it('should update the host rating after a review is created', async () => {
        mockReservationRepo.findById.mockReturnValue(completedReservation);
        mockUserRepo.findById.mockReturnValueOnce(testUser).mockReturnValueOnce(testHost);
        mockCaravanRepo.findById.mockReturnValue(testCaravan);
        mockReviewRepo.findByReservationId.mockReturnValue([]);
  
        await reviewService.createReview('res1', 'user1', 4, 'Good caravan');
  
        expect(mockUserRepo.findById).toHaveBeenCalledWith('host1');
        expect(testHost.rating).toBe(4);
      });

    it('should throw BadRequestError if reservation is not completed', async () => {
      const pendingReservation = { ...completedReservation, status: 'pending' as 'pending' };
      mockReservationRepo.findById.mockReturnValue(pendingReservation);
      mockUserRepo.findById.mockReturnValue(testUser);

      await expect(reviewService.createReview('res1', 'user1', 5, 'comment')).rejects.toThrow(BadRequestError);
    });

    it('should throw UnauthorizedError if reviewer is not the user on the reservation', async () => {
      mockReservationRepo.findById.mockReturnValue(completedReservation);
      mockUserRepo.findById.mockReturnValue({ ...testUser, id: 'user2' });

      await expect(reviewService.createReview('res1', 'user2', 5, 'comment')).rejects.toThrow(UnauthorizedError);
    });
    
    it('should throw BadRequestError if user has already reviewed', async () => {
        mockReservationRepo.findById.mockReturnValue(completedReservation);
        mockUserRepo.findById.mockReturnValue(testUser);
        mockReviewRepo.findByReservationId.mockReturnValue([{ id: 'rev1', reviewerId: 'user1', reservationId: 'res1', revieweeId: 'c1', rating: 4, comment: 'old', reviewDate: new Date() }]);
  
        await expect(reviewService.createReview('res1', 'user1', 5, 'comment')).rejects.toThrow(BadRequestError);
      });
  });
});
