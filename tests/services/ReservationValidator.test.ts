// tests/services/ReservationValidator.test.ts

import { ReservationValidator } from '../../src/services/ReservationValidator';
import { Reservation } from '../../src/models/Reservation';

describe('ReservationValidator', () => {
  let validator: ReservationValidator;

  beforeEach(() => {
    validator = new ReservationValidator();
  });

  const existingReservations: Reservation[] = [
    new Reservation(
      'res1',
      'user1',
      'caravan1',
      new Date('2025-07-10'),
      new Date('2025-07-15'),
      500,
      'approved'
    ),
  ];

  it('should return false for a reservation that does not overlap', () => {
    const newReservation = new Reservation(
      'res2',
      'caravan1',
      'user2',
      new Date('2025-07-16'),
      new Date('2025-07-20'),
      400,
      'pending'
    );
    expect(validator.hasOverlap(newReservation, existingReservations)).toBe(false);
  });

  it('should return true if the new reservation starts during an existing one', () => {
    const newReservation = new Reservation(
      'res2',
      'caravan1',
      'user2',
      new Date('2025-07-14'),
      new Date('2025-07-20'),
      600,
      'pending'
    );
    expect(validator.hasOverlap(newReservation, existingReservations)).toBe(true);
  });

  it('should return true if the new reservation ends during an existing one', () => {
    const newReservation = new Reservation(
      'res2',
      'caravan1',
      'user2',
      new Date('2025-07-05'),
      new Date('2025-07-11'),
      600,
      'pending'
    );
    expect(validator.hasOverlap(newReservation, existingReservations)).toBe(true);
  });

  it('should return true if the new reservation completely contains an existing one', () => {
    const newReservation = new Reservation(
      'res2',
      'caravan1',
      'user2',
      new Date('2025-07-09'),
      new Date('2025-07-16'),
      700,
      'pending'
    );
    expect(validator.hasOverlap(newReservation, existingReservations)).toBe(true);
  });

  it('should return true if the new reservation is completely within an existing one', () => {
    const newReservation = new Reservation(
      'res2',
      'caravan1',
      'user2',
      new Date('2025-07-11'),
      new Date('2025-07-14'),
      300,
      'pending'
    );
    expect(validator.hasOverlap(newReservation, existingReservations)).toBe(true);
  });
});
