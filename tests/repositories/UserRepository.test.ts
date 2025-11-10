// tests/repositories/UserRepository.test.ts

import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../models/User';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  const user: User = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password',
    role: 'guest',
    name: 'Test User',
    contact: '123-456-7890',
    rating: 0,
    identityVerified: false,
  };

  beforeEach(() => {
    userRepository = new UserRepository();
    userRepository.create(user);
  });

  it('should create and find a user by id', () => {
    const foundUser = userRepository.findById('user1');
    expect(foundUser).toBeDefined();
    expect(foundUser?.username).toBe('testuser');
  });

  it('should return undefined for a non-existent user id', () => {
    const foundUser = userRepository.findById('nonexistent');
    expect(foundUser).toBeUndefined();
  });

  it('should find a user by username', () => {
    const foundUser = userRepository.findByUsername('testuser');
    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe('user1');
  });

  it('should return undefined for a non-existent username', () => {
    const foundUser = userRepository.findByUsername('nonexistent');
    expect(foundUser).toBeUndefined();
  });

  it('should find all users', () => {
    const allUsers = userRepository.findAll();
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].id).toBe('user1');
  });

  it('should create a second user and find all', () => {
    const user2: User = {
      id: 'user2',
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'password',
      role: 'host',
      name: 'Test User 2',
      contact: '123-456-7890',
      rating: 0,
      identityVerified: false,
    };
    userRepository.create(user2);
    const allUsers = userRepository.findAll();
    expect(allUsers).toHaveLength(2);
  });
});
