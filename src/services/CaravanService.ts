import { Caravan } from '../models/Caravan';
import { CaravanRepository } from '../repositories/CaravanRepository';
import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError } from '../errors/HttpErrors';

export class CaravanService {
  constructor(
    private caravanRepository: CaravanRepository,
    private userRepository: UserRepository
  ) { }

  async create(data: Omit<Caravan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Caravan> {
    const host = await this.userRepository.findById(data.ownerId);
    if (!host) {
      throw new NotFoundError(`Host with ID ${data.ownerId} not found`);
    }
    if (host.role !== 'HOST') {
      throw new Error('User is not a host');
    }

    const newCaravan: Caravan = {
      ...data,
      id: 0, // Placeholder, DB will generate
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.caravanRepository.add(newCaravan);
    return newCaravan;
  }

  async getById(id: number): Promise<Caravan> {
    const caravan = await this.caravanRepository.findById(id);
    if (!caravan) {
      throw new NotFoundError(`Caravan with ID ${id} not found`);
    }
    return caravan;
  }

  async getAll(filters?: { location?: string; minPrice?: number; maxPrice?: number }): Promise<Caravan[]> {
    return this.caravanRepository.findAll(filters);
  }
}