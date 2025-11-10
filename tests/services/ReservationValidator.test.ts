// tests/services/ReservationValidator.test.ts

import { ReservationValidator } from '../../services/ReservationValidator';
import { Reservation } from '../../models/Reservation';

describe('ReservationValidator', () => {
  let validator: ReservationValidator;

  beforeEach(() => {
    validator = new ReservationValidator();
  });

  const existingReservations: Reservation[] = [
    {
      id: 'res1',
      caravanId: 'caravan1',
      userId: 'user1',
      startDate: new Date('2025-07-10'),
      endDate: new Date('2025-07-15'),
      status: 'approved',
      totalPrice: 500,
    },
  ];

  it('should return true for a reservation that does not overlap', () => {
    const newReservation: Reservation = {
      id: 'res2',
      caravanId: 'caravan1',
      userId: 'user2',
      startDate: new Date('2025-07-16'),
      endDate: new Date('2025-07-20'),
      status: 'pending',
      totalPrice: 400,
    };
    expect(validator.hasNoOverlap(newReservation, existingReservations)).toBe(true);
  });

  it('should return false if the new reservation starts during an existing one', () => {
    const newReservation: Reservation = {
      id: 'res2',
      caravanId: 'caravan1',
      userId: 'user2',
      startDate: new Date('2025-07-14'),
      endDate: new Date('2025-07-20'),
      status: 'pending',
      totalPrice: 600,
    };
    expect(validator.hasNoOverlap(newReservation, existingReservations)).toBe(false);
  });

  it('should return false if the new reservation ends during an existing one', () => {
    const newReservation: Reservation = {
      id: 'res2',
      caravanId: 'caravan1',
      userId: 'user2',
      startDate: new Date('2025-07-05'),
      endDate: new Date('2025-07-11'),
      status: 'pending',
      totalPrice: 600,
    };
    expect(validator.hasNoOverlap(newReservation, existingReservations)).toBe(false);
  });

  it('should return false if the new reservation completely contains an existing one', () => {
    const newReservation: Reservation = {
      id: 'res2',
      caravanId: 'caravan1',
      userId: 'user2',
      startDate: new Date('2025-07-09'),
      endDate: new Date('2025-07-16'),
      status: 'pending',
      totalPrice: 700,
    };
    expect(validator.hasNoOverlap(newReservation, existingReservations)).toBe(false);
  });

  it('should return false if the new reservation is completely within an existing one', () => {
    const newReservation: Reservation = {
      id: 'res2',
      caravanId: 'caravan1',
      userId: 'user2',
      startDate: new Date('2025-07-11'),
      endDate: new Date('2025-07-14'),
      status: 'pending',
      totalPrice: 300,
    };
    expect(validator.hasNoOverlap(newReservation, existingReservations)).toBe(false);
  });
});
