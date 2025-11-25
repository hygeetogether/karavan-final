import { Reservation } from '../models/Reservation';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { ReservationValidator } from './ReservationValidator';

/**
 * ReservationService orchestrates reservation creation and status updates.
 * It receives a repository and a validator via dependency injection for testability.
 */
export class ReservationService {
  constructor(
    private repo: ReservationRepository,
    private validator: ReservationValidator,
  ) { }

  /**
   * Creates a new reservation after validation.
   * Throws an Error if validation fails.
   */
  async create(reservation: Reservation): Promise<Reservation> {
    const result = await this.validator.isValid(reservation);
    if (!result.valid) {
      throw new Error(`Reservation validation failed: ${result.reason}`);
    }
    await this.repo.add(reservation);
    return reservation;
  }

  /**
   * Updates the status of an existing reservation.
   * Returns the updated reservation or throws if not found.
   */
  async updateStatus(id: number, status: Reservation['status']): Promise<Reservation> {
    const updated = await this.repo.update(id, { status });
    if (!updated) {
      throw new Error('Reservation not found');
    }
    return updated;
  }

  async getByUserId(userId: number): Promise<Reservation[]> {
    return this.repo.findByUserId(userId);
  }
}