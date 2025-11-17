// tests/services/PaymentService.test.ts

import { PaymentService } from '../../src/services/PaymentService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { PaymentRepository } from '../../src/repositories/PaymentRepository';
import { CaravanRepository } from '../../src/repositories/CaravanRepository';
import { ReservationService } from '../../src/services/ReservationService';
import { User } from '../../src/models/User';
import { Caravan } from '../../src/models/Caravan';
import { Reservation } from '../../src/models/Reservation';
import { Payment } from '../../src/models/Payment';
import { NotFoundError, BadRequestError } from '../../src/errors/HttpErrors';

jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/repositories/ReservationRepository');
jest.mock('../../src/repositories/PaymentRepository');
jest.mock('../../src/repositories/CaravanRepository');
jest.mock('../../src/services/ReservationService');

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockPaymentRepo: jest.Mocked<PaymentRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;
  let mockReservationService: jest.Mocked<ReservationService>;

  const testUser = new User('user1', 'test', 'test@test.com', 'guest', 'Test User', '123', 'pass', 500);
  const testCaravan = new Caravan('caravan1', 'host1', 'Test', 4, [], [], { latitude: 0, longitude: 0 }, 100);
  const pendingReservation = new Reservation('res1', 'user1', 'caravan1', new Date(), new Date(), 300, 'pending');

  beforeEach(() => {
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockReservationRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockPaymentRepo = new PaymentRepository() as jest.Mocked<PaymentRepository>;
    mockCaravanRepo = new CaravanRepository() as jest.Mocked<CaravanRepository>;
    mockReservationService = new (ReservationService as any)() as jest.Mocked<ReservationService>;

    paymentService = new PaymentService(mockUserRepo, mockReservationRepo, mockPaymentRepo, mockCaravanRepo, mockReservationService);
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      mockReservationRepo.findById.mockReturnValue(pendingReservation);
      mockUserRepo.findById.mockReturnValue(testUser);

      const payment = await paymentService.createPayment('pay1', 'res1');

      expect(payment.status).toBe('completed');
      expect(payment.amount).toBe(300);
      expect(mockPaymentRepo.add).toHaveBeenCalledWith(payment);
    });

    it('should throw NotFoundError if reservation does not exist', async () => {
      mockReservationRepo.findById.mockReturnValue(undefined);

      await expect(paymentService.createPayment('pay1', 'res1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPaymentHistory', () => {
    it('should return a list of payments for a user', async () => {
      const res1 = new Reservation('res1', 'user1', 'c1', new Date(), new Date(), 100, 'completed');
      const res2 = new Reservation('res2', 'user1', 'c2', new Date(), new Date(), 200, 'completed');
      const payment1 = new Payment('pay1', 'res1', 100, new Date(), 'completed');
      const payment2 = new Payment('pay2', 'res2', 200, new Date(), 'completed');

      mockReservationRepo.findAll.mockReturnValue([res1, res2]);
      mockPaymentRepo.findAll.mockReturnValue([payment1, payment2]);

      const payments = await paymentService.getPaymentHistory('user1');

      expect(payments).toHaveLength(2);
      expect(payments.map(p => p.id)).toContain('pay1');
      expect(payments.map(p => p.id)).toContain('pay2');
    });

    it('should return an empty array for a user with no payments', async () => {
        mockReservationRepo.findAll.mockReturnValue([]);
        mockPaymentRepo.findAll.mockReturnValue([]);
        const payments = await paymentService.getPaymentHistory('user1');
        expect(payments).toHaveLength(0);
    });
  });
});
