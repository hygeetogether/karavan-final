import { Reservation } from '../models/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';

/**
 * ReservationValidator contains domain validation logic for reservations.
 * It is stateless except for the injected repository, allowing easy unit testing.
 */
export class ReservationValidator {
  constructor(private repo: ReservationRepository) { }

  /**
   * Validates a reservation:
   *   - startDate must be before endDate
   *   - no overlapping reservation for the same caravan
   * Returns an object with `valid` flag and optional `reason`.
   */
  async isValid(reservation: Reservation): Promise<{ valid: boolean; reason?: string }> {
    const { startDate, endDate, caravanId } = reservation;
    if (startDate >= endDate) {
      return { valid: false, reason: 'Start date must be before end date.' };
    }
    // Check overlap with existing reservations of the same caravan
    const existing = await this.repo.findByCaravanId(caravanId);
    const overlap = existing.some(r => {
      // inclusive overlap check
      return (
        (startDate >= r.startDate && startDate <= r.endDate) ||
        (endDate >= r.startDate && endDate <= r.endDate) ||
        (r.startDate >= startDate && r.startDate <= endDate)
      );
    });
    if (overlap) {
      return { valid: false, reason: 'Reservation dates overlap with an existing reservation.' };
    }
    return { valid: true };
  }
}