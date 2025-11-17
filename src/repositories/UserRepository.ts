// src/repositories/UserRepository.ts

import { User } from '../models/User';

export class UserRepository {
  private users: Map<string, User> = new Map();

  add(user: User): void {
    this.users.set(user.id, user);
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }
}