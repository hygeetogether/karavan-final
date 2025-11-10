// src/repositories/ReservationRepository.ts

import { Reservation } from '../models/Reservation';

export class ReservationRepository {
  // In-memory store using Maps for efficient lookups
  private reservationsById: Map<string, Reservation> = new Map();
  private reservationsByCaravanId: Map<string, Reservation[]> = new Map();

  /**
   * Adds a new reservation to the repository.
   * @param reservation The reservation object to add.
   */
  public create(reservation: Reservation): void {
    // O(1) insertion
    this.reservationsById.set(reservation.id, reservation);

    // Add to the caravan-indexed map
    const forCaravan = this.reservationsByCaravanId.get(reservation.caravanId) || [];
    forCaravan.push(reservation);
    this.reservationsByCaravanId.set(reservation.caravanId, forCaravan);
  }

  /**
   * Finds a reservation by its ID.
   * @param id The ID of the reservation to find.
   * @returns The reservation object or undefined if not found.
   */
  public findById(id: string): Reservation | undefined {
    // O(1) lookup
    return this.reservationsById.get(id);
  }

  /**
   * Finds all reservations for a specific caravan.
   * @param caravanId The ID of the caravan.
   * @returns An array of reservations for the given caravan.
   */
  public findByCaravanId(caravanId: string): Reservation[] {
    // O(1) lookup for the array
    return this.reservationsByCaravanId.get(caravanId) || [];
  }

  /**
   * Finds all reservations made by a specific user.
   * @param userId The ID of the user.
   * @returns An array of reservations made by the user.
   */
  public findByUserId(userId: string): Reservation[] {
    const userReservations: Reservation[] = [];
    for (const reservation of this.reservationsById.values()) {
      if (reservation.userId === userId) {
        userReservations.push(reservation);
      }
    }
    return userReservations;
  }

  /**
   * Gets all reservations.
   * @returns An array of all reservations.
   */
  public findAll(): Reservation[] {
    return Array.from(this.reservationsById.values());
  }
}
