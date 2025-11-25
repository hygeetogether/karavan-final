// tests/services/PaymentService.test.ts

import { PaymentService } from '../../src/services/PaymentService';
import { PaymentRepository } from '../../src/repositories/PaymentRepository';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { Reservation } from '../../src/models/Reservation';
import { User } from '../../src/models/User';

jest.mock('../../src/repositories/PaymentRepository');
jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    payment: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    reservation: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockPaymentRepo: jest.Mocked<PaymentRepository>;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockPaymentRepo = new PaymentRepository() as jest.Mocked<PaymentRepository>;
    mockReservationRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    paymentService = new PaymentService(mockPaymentRepo, mockReservationRepo, mockUserRepo);
  });

  describe('create', () => {
    it('should create a payment successfully', async () => {
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

      const user: User = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: 'GUEST',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockReservationRepo.findById.mockReturnValue(Promise.resolve(reservation));
      mockUserRepo.findById.mockReturnValue(Promise.resolve(user));
      mockPaymentRepo.add.mockReturnValue(Promise.resolve());

      const payment = await paymentService.create(1, 100);

      expect(payment).toBeDefined();
      expect(payment.amount).toBe(100);
      expect(mockPaymentRepo.add).toHaveBeenCalled();
    });

    it('should throw error if reservation not found', async () => {
      mockReservationRepo.findById.mockReturnValue(Promise.resolve(undefined));

      await expect(paymentService.create(1, 100)).rejects.toThrow('Reservation not found');
    });
  });
});
