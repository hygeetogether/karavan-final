// tests/services/PaymentService.test.ts

import { PaymentService } from '../../services/PaymentService';
import { UserRepository } from '../../repositories/UserRepository';
import { ReservationRepository } from '../../repositories/ReservationRepository';
import { PaymentRepository } from '../../repositories/PaymentRepository';
import { CaravanRepository } from '../../repositories/CaravanRepository';
import { ReservationService } from '../../services/ReservationService';
import { User } from '../../models/User';
import { Caravan } from '../../models/Caravan';
import { Reservation } from '../../models/Reservation';
import { Payment } from '../../models/Payment';
import { NotFoundError, BadRequestError } from '../../errors/HttpErrors';

jest.mock('../../repositories/UserRepository');
jest.mock('../../repositories/ReservationRepository');
jest.mock('../../repositories/PaymentRepository');
jest.mock('../../repositories/CaravanRepository');
jest.mock('../../services/ReservationService');

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockReservationRepo: jest.Mocked<ReservationRepository>;
  let mockPaymentRepo: jest.Mocked<PaymentRepository>;
  let mockCaravanRepo: jest.Mocked<CaravanRepository>;
  let mockReservationService: jest.Mocked<ReservationService>;

  const testUser: User = { id: 'user1', role: 'guest', username: 'test', email: '', password: '', name: '', contact: '', rating: 0, identityVerified: true, balance: 500 };
  const testCaravan: Caravan = { id: 'caravan1', hostId: 'host1', name: 'Test', capacity: 4, amenities: [], photos: [], location: { latitude: 0, longitude: 0 }, status: 'available', dailyRate: 100 };
  const pendingReservation: Reservation = { id: 'res1', userId: 'user1', caravanId: 'caravan1', startDate: new Date(), endDate: new Date(), status: 'pending', totalPrice: 300 };

  beforeEach(() => {
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    mockReservationRepo = new ReservationRepository() as jest.Mocked<ReservationRepository>;
    mockPaymentRepo = new PaymentRepository() as jest.Mocked<PaymentRepository>;
    mockCaravanRepo = new CaravanRepository() as jest.Mocked<CaravanRepository>;
    mockReservationService = new ReservationService(mockReservationRepo, mockCaravanRepo, mockUserRepo, {} as any) as jest.Mocked<ReservationService>;

    paymentService = new PaymentService(mockUserRepo, mockReservationRepo, mockPaymentRepo, mockCaravanRepo, mockReservationService);
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      mockUserRepo.findById.mockReturnValue({ ...testUser });
      mockReservationRepo.findById.mockReturnValue({ ...pendingReservation });
      mockCaravanRepo.findById.mockReturnValue(testCaravan);
      mockReservationService.approveReservation.mockResolvedValue({ ...pendingReservation, status: 'approved' });

      const payment = await paymentService.processPayment('user1', 'res1');

      expect(payment.status).toBe('completed');
      expect(payment.amount).toBe(300);
      expect(mockPaymentRepo.create).toHaveBeenCalledWith(payment);
      expect(mockUserRepo.findById('user1')?.balance).toBe(200);
      expect(mockReservationService.approveReservation).toHaveBeenCalledWith('res1', 'host1');
    });

    it('should throw BadRequestError for insufficient balance', async () => {
      const userWithLowBalance = { ...testUser, balance: 100 };
      mockUserRepo.findById.mockReturnValue(userWithLowBalance);
      mockReservationRepo.findById.mockReturnValue(pendingReservation);

      await expect(paymentService.processPayment('user1', 'res1')).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError if reservation does not exist', async () => {
      mockUserRepo.findById.mockReturnValue(testUser);
      mockReservationRepo.findById.mockReturnValue(undefined);

      await expect(paymentService.processPayment('user1', 'res1')).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if reservation is not pending', async () => {
      const approvedReservation = { ...pendingReservation, status: 'approved' as 'approved' };
      mockUserRepo.findById.mockReturnValue(testUser);
      mockReservationRepo.findById.mockReturnValue(approvedReservation);

      await expect(paymentService.processPayment('user1', 'res1')).rejects.toThrow(BadRequestError);
    });
  });

  describe('getPaymentHistory', () => {
    it('should return a list of payments for a user', async () => {
      const res1: Reservation = { id: 'res1', userId: 'user1', caravanId: 'c1', status: 'completed', totalPrice: 100, startDate: new Date(), endDate: new Date() };
      const res2: Reservation = { id: 'res2', userId: 'user1', caravanId: 'c2', status: 'completed', totalPrice: 200, startDate: new Date(), endDate: new Date() };
      const payment1: Payment = { id: 'pay1', reservationId: 'res1', amount: 100, status: 'completed', paymentDate: new Date() };
      const payment2: Payment = { id: 'pay2', reservationId: 'res2', amount: 200, status: 'completed', paymentDate: new Date() };

      mockReservationRepo.findByUserId.mockReturnValue([res1, res2]);
      mockPaymentRepo.findByReservationId.mockImplementation(resId => {
        if (resId === 'res1') return payment1;
        if (resId === 'res2') return payment2;
        return undefined;
      });

      const payments = await paymentService.getPaymentHistory('user1');

      expect(payments).toHaveLength(2);
      expect(payments.map(p => p.id)).toContain('pay1');
      expect(payments.map(p => p.id)).toContain('pay2');
    });

    it('should return an empty array for a user with no payments', async () => {
        mockReservationRepo.findByUserId.mockReturnValue([]);
        const payments = await paymentService.getPaymentHistory('user1');
        expect(payments).toHaveLength(0);
    });
  });
});
