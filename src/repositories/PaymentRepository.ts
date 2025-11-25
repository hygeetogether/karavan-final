import prisma from '../lib/prisma';
import { Payment, PaymentStatus } from '../models/Payment';

export class PaymentRepository {
  async add(payment: Payment): Promise<void> {
    await prisma.payment.create({
      data: {
        id: payment.id,
        reservationId: payment.reservationId,
        userId: payment.userId,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        status: payment.status
      }
    });
  }

  async findById(id: number): Promise<Payment | undefined> {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return undefined;
    return {
      ...payment,
      status: payment.status as PaymentStatus
    };
  }

  async findByUserId(userId: number): Promise<Payment[]> {
    const payments = await prisma.payment.findMany({ where: { userId } });
    return payments.map(p => ({
      ...p,
      status: p.status as PaymentStatus
    }));
  }
}