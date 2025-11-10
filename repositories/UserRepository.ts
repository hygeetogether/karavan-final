// src/repositories/UserRepository.ts

import { User } from '../models/User';

export class UserRepository {
  private usersById: Map<string, User> = new Map();
  private usersByUsername: Map<string, User> = new Map();

  public create(user: User): void {
    this.usersById.set(user.id, user);
    this.usersByUsername.set(user.username, user);
  }

  public findById(id: string): User | undefined {
    return this.usersById.get(id);
  }

  public findByUsername(username: string): User | undefined {
    return this.usersByUsername.get(username);
  }

  public findAll(): User[] {
    return Array.from(this.usersById.values());
  }
}
