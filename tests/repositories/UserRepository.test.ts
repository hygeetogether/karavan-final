// tests/repositories/UserRepository.test.ts

import { UserRepository } from '../../src/repositories/UserRepository';
import { User } from '../../src/models/User';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  const user = new User(
    'user1',
    'testuser',
    'test@example.com',
    'guest',
    'Test User',
    '123-456-7890',
    'password'
  );

  beforeEach(() => {
    userRepository = new UserRepository();
    userRepository.add(user);
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

  it('should find a user by email', () => {
    const foundUser = userRepository.findByEmail('test@example.com');
    expect(foundUser).toBeDefined();
    expect(foundUser?.id).toBe('user1');
  });

  it('should return undefined for a non-existent email', () => {
    const foundUser = userRepository.findByEmail('nonexistent@example.com');
    expect(foundUser).toBeUndefined();
  });

  it('should find all users', () => {
    const allUsers = userRepository.findAll();
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].id).toBe('user1');
  });

  it('should create a second user and find all', () => {
    const user2 = new User(
      'user2',
      'testuser2',
      'test2@example.com',
      'host',
      'Test User 2',
      '123-456-7890',
      'password'
    );
    userRepository.add(user2);
    const allUsers = userRepository.findAll();
    expect(allUsers).toHaveLength(2);
  });
});
