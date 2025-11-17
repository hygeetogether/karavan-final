// tests/services/ReservationService.test.ts

import { ReservationService } from '../../src/services/ReservationService';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { CaravanRepository } from '../../src/repositories/CaravanRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { ReservationValidator } from '../../src/services/ReservationValidator';
import { User } from '../../src/models/User';
import { Caravan } from '../../src/models/Caravan';
import { Reservation } from '../../src/models/Reservation';
import { NotFoundError, BadRequestError } from '../../src/errors/HttpErrors';
import { ReservationConflictError, InsufficientFundsError } from '../../src/errors/DomainErrors';

jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/repositories/CaravanRepository');
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/services/ReservationValidator');

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockValidator: jest.Mocked<ReservationValidator>;

  const testUser = new User('user1', 'test', 'test@test.com', 'guest', 'Test User', '123', 'pass', 500);
  const testCaravan = new Caravan('caravan1', 'host1', 'Test', 4, [], [], { latitude: 0, longitude: 0 }, 100);
  const pendingReservation = new Reservation('res1', 'user1', 'caravan1', new Date(), new Date(), 100, 'pending');

  beforeEach(() => {
    mockReservationRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockCaravanRepo = new CaravanRepository() as jest.Mocked<CaravanRepository>;
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockValidator = new ReservationValidator() as jest.Mocked<ReservationValidator>;

    reservationService = new ReservationService(mockReservationRepo, mockCaravanRepo, mockUserRepo, mockValidator);
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      mockUserRepo.findById.mockReturnValue(testUser);
      mockCaravanRepo.findById.mockReturnValue(testCaravan);
      mockValidator.hasOverlap.mockReturnValue(false);

      const startDate = new Date('2025-08-01');
      const endDate = new Date('2025-08-05');
      const reservation = await reservationService.createReservation('res2', 'user1', 'caravan1', startDate, endDate);

      expect(reservation).toBeDefined();
      expect(reservation.totalPrice).toBe(400); // 4 days * 100 daily rate
      expect(mockReservationRepo.add).toHaveBeenCalledWith(reservation);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      mockUserRepo.findById.mockReturnValue(undefined);
      const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
      await expect(reservationService.createReservation('res2', 'user1', 'caravan1', dates.start, dates.end))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw InsufficientFundsError if user has insufficient funds', async () => {
        const userWithLowBalance = new User('user1', 'test', 'test@test.com', 'guest', 'Test User', '123', 'pass', 100);
        mockUserRepo.findById.mockReturnValue(userWithLowBalance);
        mockCaravanRepo.findById.mockReturnValue(testCaravan);
        const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
        await expect(reservationService.createReservation('res2', 'user1', 'caravan1', dates.start, dates.end))
            .rejects.toThrow(InsufficientFundsError);
    });

    it('should throw ReservationConflictError if reservations overlap', async () => {
        mockUserRepo.findById.mockReturnValue(testUser);
        mockCaravanRepo.findById.mockReturnValue(testCaravan);
        mockValidator.hasOverlap.mockReturnValue(true); // Simulate validation failure
        const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
        await expect(reservationService.createReservation('res2', 'user1', 'caravan1', dates.start, dates.end))
          .rejects.toThrow(ReservationConflictError);
    });
  });

  describe('approveReservation', () => {
    it('should approve a pending reservation successfully', async () => {
      mockReservationRepo.findById.mockImplementation(() => Promise.resolve(pendingReservation));
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      const approvedReservation = await reservationService.approveReservation('res1', 'host1');

      expect(approvedReservation.status).toBe('approved');
    });

    it('should throw NotFoundError if reservation does not exist', async () => {
      mockReservationRepo.findById.mockImplementation(() => Promise.resolve(undefined));
      await expect(reservationService.approveReservation('res1', 'host1')).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if hostId does not match', async () => {
      mockReservationRepo.findById.mockImplementation(() => Promise.resolve(pendingReservation));
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      await expect(reservationService.approveReservation('res1', 'wrongHost')).rejects.toThrow(BadRequestError);
    });
  });

  describe('rejectReservation', () => {
    it('should reject a pending reservation successfully', async () => {
      mockReservationRepo.findById.mockImplementation(() => Promise.resolve(pendingReservation));
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      const rejectedReservation = await reservationService.rejectReservation('res1', 'host1');

      expect(rejectedReservation.status).toBe('rejected');
    });

    it('should throw NotFoundError if reservation does not exist', async () => {
      mockReservationRepo.findById.mockImplementation(() => Promise.resolve(undefined));
      await expect(reservationService.rejectReservation('res1', 'host1')).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if hostId does not match', async () => {
      mockReservationRepo.findById.mockImplementation(() => Promise.resolve(pendingReservation));
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      await expect(reservationService.rejectReservation('res1', 'wrongHost')).rejects.toThrow(BadRequestError);
    });
  });
});
