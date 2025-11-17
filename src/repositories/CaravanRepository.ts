// src/repositories/CaravanRepository.ts

import { Caravan } from '../models/Caravan';

export class CaravanRepository {
  private caravans: Map<string, Caravan> = new Map();

  add(caravan: Caravan): void {
    this.caravans.set(caravan.id, caravan);
  }

  findById(id: string): Caravan | undefined {
    return this.caravans.get(id);
  }

  findAll(): Caravan[] {
    return Array.from(this.caravans.values());
  }
}