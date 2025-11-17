// tests/repositories/ReservationRepository.test.ts

import { ReservationRepository } from '../../src/repositories/ReservationRepository';
import { Reservation } from '../../src/models/Reservation';

describe('ReservationRepository', () => {
  let reservationRepository: ReservationRepository;

  const res1 = new Reservation('res1', 'user1', 'caravan1', new Date(), new Date(), 100, 'approved');
  const res2 = new Reservation('res2', 'user2', 'caravan1', new Date(), new Date(), 200, 'pending');
  const res3 = new Reservation('res3', 'user1', 'caravan2', new Date(), new Date(), 300, 'completed');

  beforeEach(() => {
    reservationRepository = new ReservationRepository();
    reservationRepository.add(res1);
    reservationRepository.add(res2);
    reservationRepository.add(res3);
  });

  it('should find reservations by caravan id', () => {
    const caravan1Reservations = reservationRepository.findByCaravanId('caravan1');
    expect(caravan1Reservations).toHaveLength(2);
    expect(caravan1Reservations.map(r => r.id)).toContain('res1');
    expect(caravan1Reservations.map(r => r.id)).toContain('res2');
  });

  it('should return an empty array for a caravan with no reservations', () => {
    const caravan3Reservations = reservationRepository.findByCaravanId('caravan3');
    expect(caravan3Reservations).toHaveLength(0);
  });
});
