import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError } from '../errors/HttpErrors';

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Simple ID generation
    const id = Date.now();

    const newUser: User = {
      ...data,
      id: 0, // Placeholder for Prisma autoincrement
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.userRepository.add(newUser);
    return newUser;
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}