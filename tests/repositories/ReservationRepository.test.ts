// tests/repositories/ReservationRepository.test.ts

import { ReservationRepository } from '../../repositories/ReservationRepository';
import { Reservation } from '../../models/Reservation';

describe('ReservationRepository', () => {
  let reservationRepository: ReservationRepository;

  const res1: Reservation = { id: 'res1', userId: 'user1', caravanId: 'caravan1', status: 'approved', startDate: new Date(), endDate: new Date(), totalPrice: 100 };
  const res2: Reservation = { id: 'res2', userId: 'user2', caravanId: 'caravan1', status: 'pending', startDate: new Date(), endDate: new Date(), totalPrice: 200 };
  const res3: Reservation = { id: 'res3', userId: 'user1', caravanId: 'caravan2', status: 'completed', startDate: new Date(), endDate: new Date(), totalPrice: 300 };

  beforeEach(() => {
    reservationRepository = new ReservationRepository();
    reservationRepository.create(res1);
    reservationRepository.create(res2);
    reservationRepository.create(res3);
  });

  it('should find reservations by user id', () => {
    const user1Reservations = reservationRepository.findByUserId('user1');
    expect(user1Reservations).toHaveLength(2);
    expect(user1Reservations.map(r => r.id)).toContain('res1');
    expect(user1Reservations.map(r => r.id)).toContain('res3');
  });

  it('should return an empty array for a user with no reservations', () => {
    const user3Reservations = reservationRepository.findByUserId('user3');
    expect(user3Reservations).toHaveLength(0);
  });
});
