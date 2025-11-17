// src/services/UserService.ts

import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError } from '../errors/HttpErrors';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Creates a new user.
   * @param id The user's ID.
   * @param username The user's username.
   * @param email The user's email.
   * @param role The user's role.
   * @param name The user's name.
   * @param contact The user's contact information.
   * @param password The user's password.
   * @returns The newly created user.
   */
  async createUser(
    id: string,
    username: string,
    email: string,
    role: 'host' | 'guest',
    name: string,
    contact: string,
    password?: string
  ): Promise<User> {
    const user = new User(id, username, email, role, name, contact, password);
    this.userRepository.add(user);
    return user;
  }

  /**
   * Gets a user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns The user if found.
   * @throws NotFoundError if the user is not found.
   */
  async getUserById(id: string): Promise<User> {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Gets all users.
   * @returns A list of all users.
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}