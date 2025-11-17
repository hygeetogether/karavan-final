// src/services/ReservationValidator.ts

import { Reservation } from '../models/Reservation';

export class ReservationValidator {
  /**
   * Checks for overlapping reservations for a given caravan.
   * @param reservation The reservation to be checked.
   * @param existingReservations An array of existing reservations for the same caravan.
   * @returns boolean True if there is an overlap, false otherwise.
   */
  hasOverlap(reservation: Reservation, existingReservations: Reservation[]): boolean {
    for (const existing of existingReservations) {
      if (
        (reservation.startDate >= existing.startDate && reservation.startDate < existing.endDate) ||
        (reservation.endDate > existing.startDate && reservation.endDate <= existing.endDate) ||
        (reservation.startDate <= existing.startDate && reservation.endDate >= existing.endDate)
      ) {
        return true; // Overlap found
      }
    }
    return false; // No overlap
  }
}