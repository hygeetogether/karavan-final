// src/repositories/ReservationRepository.ts

import { Reservation } from '../models/Reservation';

export class ReservationRepository {
  private reservations: Map<string, Reservation> = new Map();

  /**
   * Adds a new reservation.
   * @param reservation The reservation to add.
   */
  add(reservation: Reservation): void {
    this.reservations.set(reservation.id, reservation);
  }

  /**
   * Finds a reservation by its ID.
   * @param id The ID of the reservation.
   * @returns The reservation if found, otherwise undefined.
   */
  findById(id: string): Reservation | undefined {
    return this.reservations.get(id);
  }

  /**
   * Finds all reservations for a given caravan.
   * @param caravanId The ID of the caravan.
   * @returns An array of reservations for the caravan.
   */
  findByCaravanId(caravanId: string): Reservation[] {
    const results: Reservation[] = [];
    for (const reservation of this.reservations.values()) {
      if (reservation.caravanId === caravanId) {
        results.push(reservation);
      }
    }
    return results;
  }

  /**
   * Finds all reservations.
   * @returns An array of all reservations.
   */
  findAll(): Reservation[] {
    return Array.from(this.reservations.values());
  }
}