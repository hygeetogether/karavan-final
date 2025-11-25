import prisma from '../lib/prisma';
import { Reservation, ReservationStatus } from '../models/Reservation';

export class ReservationRepository {
  async add(reservation: Reservation): Promise<void> {
    await prisma.reservation.create({
      data: {
        id: reservation.id,
        userId: reservation.userId,
        caravanId: reservation.caravanId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: reservation.status,
        totalPrice: reservation.totalPrice,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt
      }
    });
  }

  async findById(id: number): Promise<Reservation | undefined> {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return undefined;
    return {
      ...reservation,
      status: reservation.status as ReservationStatus
    };
  }

  async findByCaravanId(caravanId: number): Promise<Reservation[]> {
    const reservations = await prisma.reservation.findMany({ where: { caravanId } });
    return reservations.map(r => ({
      ...r,
      status: r.status as ReservationStatus
    }));
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    const reservations = await prisma.reservation.findMany({ where: { userId } });
    return reservations.map(r => ({
      ...r,
      status: r.status as ReservationStatus
    }));
  }

  async update(id: number, updates: Partial<Reservation>): Promise<Reservation | undefined> {
    try {
      const reservation = await prisma.reservation.update({
        where: { id },
        data: updates
      });
      return {
        ...reservation,
        status: reservation.status as ReservationStatus
      };
    } catch (error) {
      return undefined;
    }
  }

  async updateStatus(id: number, status: ReservationStatus): Promise<void> {
    await prisma.reservation.update({
      where: { id },
      data: { status }
    });
  }
}