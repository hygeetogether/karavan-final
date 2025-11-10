// src/services/ReservationValidator.ts

import { Reservation } from '../models/Reservation';

export class ReservationValidator {
  
  /**
   * Checks if a new reservation overlaps with existing reservations for the same caravan.
   * @param newReservation The new reservation to validate.
   * @param existingReservations An array of existing reservations for the same caravan.
   * @returns True if the new reservation is valid (no overlap), false otherwise.
   */
  public hasNoOverlap(newReservation: Reservation, existingReservations: Reservation[]): boolean {
    for (const existing of existingReservations) {
      const newStartsDuringExisting = newReservation.startDate >= existing.startDate && newReservation.startDate <= existing.endDate;
      const newEndsDuringExisting = newReservation.endDate >= existing.startDate && newReservation.endDate <= existing.endDate;
      const existingIsWithinNew = newReservation.startDate <= existing.startDate && newReservation.endDate >= existing.endDate;

      if (newStartsDuringExisting || newEndsDuringExisting || existingIsWithinNew) {
        return false; // Overlap detected
      }
    }
    return true; // No overlap
  }

  /**
   * Validates the entire reservation logic.
   * This can be extended with more validation rules.
   * @param newReservation The new reservation to validate.
   * @param existingReservations An array of existing reservations for the same caravan.
   * @returns True if the reservation is valid, false otherwise.
   */
  public validate(newReservation: Reservation, existingReservations: Reservation[]): boolean {
    if (!this.hasNoOverlap(newReservation, existingReservations)) {
      // In a real app, we would throw a specific error here (Assignment 5)
      console.error('Validation Error: Reservation dates overlap with an existing reservation.');
      return false;
    }

    // Other validation rules can be added here, e.g.:
    // - Is the start date before the end date?
    // - Is the reservation for a minimum number of days?
    // - Is the user verified?

    return true;
  }
}
