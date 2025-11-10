// src/repositories/CaravanRepository.ts

import { Caravan } from '../models/Caravan';

export class CaravanRepository {
  private caravansById: Map<string, Caravan> = new Map();

  public create(caravan: Caravan): void {
    this.caravansById.set(caravan.id, caravan);
  }

  public findById(id: string): Caravan | undefined {
    return this.caravansById.get(id);
  }

  public findAll(): Caravan[] {
    return Array.from(this.caravansById.values());
  }
}
