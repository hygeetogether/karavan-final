import prisma from '../lib/prisma';
import { Caravan, CaravanStatus } from '../models/Caravan';

export class CaravanRepository {
  async add(caravan: Caravan): Promise<void> {
    await prisma.caravan.create({
      data: {
        id: caravan.id,
        ownerId: caravan.ownerId,
        name: caravan.name,
        capacity: caravan.capacity,
        photos: caravan.photos as any,
        amenities: caravan.amenities as any,
        location: caravan.location as any,
        status: caravan.status,
        dailyRate: caravan.dailyRate,
        createdAt: caravan.createdAt,
        updatedAt: caravan.updatedAt
      }
    });
  }

  async findById(id: number): Promise<Caravan | undefined> {
    const caravan = await prisma.caravan.findUnique({ where: { id } });
    if (!caravan) return undefined;
    return {
      ...caravan,
      amenities: caravan.amenities as string[],
      photos: caravan.photos as string[],
      location: caravan.location as any,
      status: caravan.status as CaravanStatus
    };
  }

  async findAll(filters?: { location?: string; minPrice?: number; maxPrice?: number }): Promise<Caravan[]> {
    const where: any = {};

    if (filters?.minPrice || filters?.maxPrice) {
      where.dailyRate = {};
      if (filters.minPrice) where.dailyRate.gte = filters.minPrice;
      if (filters.maxPrice) where.dailyRate.lte = filters.maxPrice;
    }

    const caravans = await prisma.caravan.findMany({
      where: {
        dailyRate: where.dailyRate
      }
    });

    let results = caravans.map(c => ({
      ...c,
      amenities: c.amenities as string[],
      photos: c.photos as string[],
      location: c.location as any,
      status: c.status as CaravanStatus
    }));

    if (filters?.location) {
      const locLower = filters.location.toLowerCase();
      results = results.filter(c =>
        (c.location?.address as string)?.toLowerCase().includes(locLower) ||
        (c.location?.city as string)?.toLowerCase().includes(locLower) ||
        (c.location?.country as string)?.toLowerCase().includes(locLower)
      );
    }

    return results;
  }

  async findByOwnerId(ownerId: number): Promise<Caravan[]> {
    const caravans = await prisma.caravan.findMany({ where: { ownerId } });
    return caravans.map(c => ({
      ...c,
      amenities: c.amenities as string[],
      photos: c.photos as string[],
      location: c.location as any,
      status: c.status as CaravanStatus
    }));
  }
}