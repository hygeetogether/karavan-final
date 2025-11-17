// src/services/CaravanService.ts

import { Caravan } from '../models/Caravan';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError } from '../errors/HttpErrors';

export class CaravanService {
  constructor(
    private caravanRepository: CaravanRepository,
    private userRepository: UserRepository
  ) {}

  /**
   * Creates a new caravan.
   * @param id The caravan's ID.
   * @param hostId The ID of the host user.
   * @param name The name of the caravan.
   * @param capacity The capacity of the caravan.
   * @param amenities The amenities of the caravan.
   * @param photos The photos of the caravan.
   * @param location The location of the caravan.
   * @param dailyRate The daily rate of the caravan.
   * @returns The newly created caravan.
   * @throws NotFoundError if the host is not found.
   */
  async createCaravan(
    id: string,
    hostId: string,
    name: string,
    capacity: number,
    amenities: string[],
    photos: string[],
    location: { latitude: number; longitude: number },
    dailyRate: number
  ): Promise<Caravan> {
    const host = this.userRepository.findById(hostId);
    if (!host || host.role !== 'host') {
      throw new NotFoundError('Host not found');
    }
    const caravan = new Caravan(id, hostId, name, capacity, amenities, photos, location, dailyRate);
    this.caravanRepository.add(caravan);
    return caravan;
  }

  /**
   * Gets a caravan by its ID.
   * @param id The ID of the caravan to retrieve.
   * @returns The caravan if found.
   * @throws NotFoundError if the caravan is not found.
   */
  async getCaravanById(id: string): Promise<Caravan> {
    const caravan = this.caravanRepository.findById(id);
    if (!caravan) {
      throw new NotFoundError('Caravan not found');
    }
    return caravan;
  }

  /**
   * Gets all caravans.
   * @returns A list of all caravans.
   */
  async getAllCaravans(): Promise<Caravan[]> {
    return this.caravanRepository.findAll();
  }
}