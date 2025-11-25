import prisma from '../lib/prisma';
import { User, Role } from '../models/User';

export class UserRepository {
  async add(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return undefined;
    return {
      ...user,
      role: user.role as Role
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return undefined;
    return {
      ...user,
      role: user.role as Role
    };
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(user => ({
      ...user,
      role: user.role as Role
    }));
  }

  async update(id: number, updates: Partial<User>): Promise<User | undefined> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updates
      });
      return {
        ...user,
        role: user.role as Role
      };
    } catch (error) {
      return undefined;
    }
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}