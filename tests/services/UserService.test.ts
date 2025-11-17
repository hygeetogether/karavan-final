// tests/services/UserService.test.ts

import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { User } from '../../src/models/User';

// Mock the UserRepository
jest.mock('../../src/repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Create a new mocked repository for each test
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
  });

  it('should create a user successfully', async () => {
    const user = new User(
      '1',
      'testuser',
      'test@example.com',
      'guest',
      'Test User',
      '1234567890'
    );

    // Mock the add method of the repository
    userRepository.add.mockImplementation(() => {});

    const createdUser = await userService.createUser(
      '1',
      'testuser',
      'test@example.com',
      'guest',
      'Test User',
      '1234567890'
    );

    expect(createdUser).toEqual(user);
    expect(userRepository.add).toHaveBeenCalledWith(user);
    expect(userRepository.add).toHaveBeenCalledTimes(1);
  });
});
