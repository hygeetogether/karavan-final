// tests/services/ReservationValidator.test.ts

import { ReservationValidator } from '../../src/services/ReservationValidator';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { Reservation } from '../../src/models/Reservation';

jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    reservation: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

describe('ReservationValidator', () => {
  let validator: ReservationValidator;
  let mockRepo: jest.Mocked<ReservationRepository>;

  beforeEach(() => {
    mockRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    validator = new ReservationValidator(mockRepo);
  });

  describe('isValid', () => {
    it('should return valid if dates are correct and no overlap', async () => {
      const reservation: Reservation = {
        id: 1,
        userId: 1,
        caravanId: 1,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-05'),
        status: 'PENDING',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepo.findByCaravanId.mockReturnValue(Promise.resolve([]));

      const result = await validator.isValid(reservation);
      expect(result.valid).toBe(true);
    });

    it('should return invalid if start date is after end date', async () => {
      const reservation: Reservation = {
        id: 1,
        userId: 1,
        caravanId: 1,
        startDate: new Date('2023-01-05'),
        endDate: new Date('2023-01-01'),
        status: 'PENDING',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await validator.isValid(reservation);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Start date must be before end date');
    });

    it('should return invalid if overlap exists', async () => {
      const existingReservation: Reservation = {
        id: 2,
        userId: 2,
        caravanId: 1,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-05'),
        status: 'APPROVED',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newReservation: Reservation = {
        id: 1,
        userId: 1,
        caravanId: 1,
        startDate: new Date('2023-01-03'), // Overlaps
        endDate: new Date('2023-01-07'),
        status: 'PENDING',
        totalPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepo.findByCaravanId.mockReturnValue(Promise.resolve([existingReservation]));

      const result = await validator.isValid(newReservation);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('overlap');
    });
  });
});
