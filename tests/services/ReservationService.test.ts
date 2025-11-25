// tests/services/ReservationService.test.ts

import { ReservationService } from '../../src/services/ReservationService';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { ReservationValidator } from '../../src/services/ReservationValidator';
import { Reservation } from '../../src/models/Reservation';

jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/services/ReservationValidator');
jest.mock('../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    reservation: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let mockRepo: jest.Mocked<ReservationRepository>;
  let mockValidator: jest.Mocked<ReservationValidator>;

  beforeEach(() => {
    mockRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockValidator = new ReservationValidator(mockRepo) as jest.Mocked<ReservationValidator>;
    reservationService = new ReservationService(mockRepo, mockValidator);
  });

  describe('create', () => {
    it('should create a reservation if validation passes', async () => {
      const reservation: Reservation = {
        id: 1,
        userId: 1,
        caravanId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'PENDING',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockValidator.isValid.mockReturnValue(Promise.resolve({ valid: true }));
      mockRepo.add.mockImplementation(() => Promise.resolve());

      const result = await reservationService.create(reservation);

      expect(mockValidator.isValid).toHaveBeenCalledWith(reservation);
      expect(mockRepo.add).toHaveBeenCalledWith(reservation);
      expect(result).toBe(reservation);
    });

    it('should throw error if validation fails', async () => {
      const reservation: Reservation = {
        id: 1,
        userId: 1,
        caravanId: 1,
        startDate: new Date(),
        endDate: new Date(),
        status: 'PENDING',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockValidator.isValid.mockReturnValue(Promise.resolve({ valid: false, reason: 'Overlap' }));

      await expect(reservationService.create(reservation)).rejects.toThrow('Reservation validation failed: Overlap');
      expect(mockRepo.add).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully', async () => {
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

      mockRepo.update.mockReturnValue(Promise.resolve(reservation));

      const result = await reservationService.updateStatus(1, 'APPROVED');

      expect(mockRepo.update).toHaveBeenCalledWith(1, { status: 'APPROVED' });
      expect(result).toBe(reservation);
    });

    it('should throw error if reservation not found', async () => {
      mockRepo.update.mockReturnValue(Promise.resolve(undefined));

      await expect(reservationService.updateStatus(1, 'APPROVED')).rejects.toThrow('Reservation not found');
    });
  });
});
