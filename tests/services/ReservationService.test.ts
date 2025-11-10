// tests/services/ReservationService.test.ts

import { ReservationService } from '../../services/ReservationService';
import { ReservationRepository } from '../../repositories/ReservationRepository';
import { CaravanRepository } from '../../repositories/CaravanRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { ReservationValidator } from '../../services/ReservationValidator';
import { User } from '../../models/User';
import { Caravan } from '../../models/Caravan';
import { Reservation } from '../../models/Reservation';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../../errors/HttpErrors';

jest.mock('../../repositories/ReservationRepository');
jest.mock('../../repositories/CaravanRepository');
jest.mock('../../repositories/UserRepository');
jest.mock('../../services/ReservationValidator');

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockValidator: jest.Mocked<ReservationValidator>;

  const testUser: User = { id: 'user1', role: 'guest', username: 'test', email: '', password: '', name: '', contact: '', rating: 0, identityVerified: true };
  const testCaravan: Caravan = { id: 'caravan1', hostId: 'host1', name: 'Test', capacity: 4, amenities: [], photos: [], location: { latitude: 0, longitude: 0 }, status: 'available', dailyRate: 100 };
  const pendingReservation: Reservation = { id: 'res1', userId: 'user1', caravanId: 'caravan1', startDate: new Date(), endDate: new Date(), status: 'pending', totalPrice: 100 };

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
      mockValidator.validate.mockReturnValue(true);
      mockReservationRepo.findByCaravanId.mockReturnValue([]);

      const startDate = new Date('2025-08-01');
      const endDate = new Date('2025-08-05');
      const reservation = await reservationService.createReservation('user1', 'caravan1', startDate, endDate);

      expect(reservation).toBeDefined();
      expect(reservation.totalPrice).toBe(400); // 4 days * 100 daily rate
      expect(mockReservationRepo.create).toHaveBeenCalledWith(reservation);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      mockUserRepo.findById.mockReturnValue(undefined);
      const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
      await expect(reservationService.createReservation('user1', 'caravan1', dates.start, dates.end))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if caravan does not exist', async () => {
        mockUserRepo.findById.mockReturnValue(testUser);
        mockCaravanRepo.findById.mockReturnValue(undefined);
        const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
        await expect(reservationService.createReservation('user1', 'caravan1', dates.start, dates.end))
          .rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if caravan is not available', async () => {
        const reservedCaravan = { ...testCaravan, status: 'reserved' as 'reserved' };
        mockUserRepo.findById.mockReturnValue(testUser);
        mockCaravanRepo.findById.mockReturnValue(reservedCaravan);
        const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
        await expect(reservationService.createReservation('user1', 'caravan1', dates.start, dates.end))
          .rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError if validation fails', async () => {
        mockUserRepo.findById.mockReturnValue(testUser);
        mockCaravanRepo.findById.mockReturnValue(testCaravan);
        mockValidator.validate.mockReturnValue(false); // Simulate validation failure
        const dates = { start: new Date('2025-08-01'), end: new Date('2025-08-05') };
        await expect(reservationService.createReservation('user1', 'caravan1', dates.start, dates.end))
          .rejects.toThrow(BadRequestError);
    });
  });

  describe('approveReservation', () => {
    it('should approve a pending reservation successfully', async () => {
      mockReservationRepo.findById.mockReturnValue({ ...pendingReservation });
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      const approvedReservation = await reservationService.approveReservation('res1', 'host1');

      expect(approvedReservation.status).toBe('approved');
    });

    it('should throw NotFoundError if reservation does not exist', async () => {
      mockReservationRepo.findById.mockReturnValue(undefined);
      await expect(reservationService.approveReservation('res1', 'host1')).rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError if hostId does not match', async () => {
      mockReservationRepo.findById.mockReturnValue({ ...pendingReservation });
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      await expect(reservationService.approveReservation('res1', 'wrongHost')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw BadRequestError if reservation is not pending', async () => {
      const approvedReservation = { ...pendingReservation, status: 'approved' as 'approved' };
      mockReservationRepo.findById.mockReturnValue(approvedReservation);
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      await expect(reservationService.approveReservation('res1', 'host1')).rejects.toThrow(BadRequestError);
    });
  });

  describe('rejectReservation', () => {
    it('should reject a pending reservation successfully', async () => {
      mockReservationRepo.findById.mockReturnValue({ ...pendingReservation });
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      const rejectedReservation = await reservationService.rejectReservation('res1', 'host1');

      expect(rejectedReservation.status).toBe('rejected');
    });

    it('should throw NotFoundError if reservation does not exist', async () => {
      mockReservationRepo.findById.mockReturnValue(undefined);
      await expect(reservationService.rejectReservation('res1', 'host1')).rejects.toThrow(NotFoundError);
    });

    it('should throw UnauthorizedError if hostId does not match', async () => {
      mockReservationRepo.findById.mockReturnValue({ ...pendingReservation });
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      await expect(reservationService.rejectReservation('res1', 'wrongHost')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw BadRequestError if reservation is not pending', async () => {
      const approvedReservation = { ...pendingReservation, status: 'approved' as 'approved' };
      mockReservationRepo.findById.mockReturnValue(approvedReservation);
      mockCaravanRepo.findById.mockReturnValue(testCaravan);

      await expect(reservationService.rejectReservation('res1', 'host1')).rejects.toThrow(BadRequestError);
    });
  });
});
