// tests/services/UserService.test.ts

import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { User } from '../../src/models/User';

jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  },
}));

describe('UserService', () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockRepo);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
    });
  });

  describe('getById', () => {
    it('should return user if found', async () => {
      const user: User = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        role: 'GUEST',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepo.findById.mockReturnValue(Promise.resolve(user));

      const result = await userService.getById(1);
      expect(result).toBe(user);
    });

    it('should throw error if user not found', async () => {
      mockRepo.findById.mockReturnValue(Promise.resolve(undefined));
      await expect(userService.getById(1)).rejects.toThrow('User with ID 1 not found');
    });
  });
});
