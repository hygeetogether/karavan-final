// tests/controllers/UserController.test.ts

import { createUserController } from '../../src/controllers/UserController';
import { UserService } from '../../src/services/UserService';
import { User } from '../../src/models/User';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ConflictError } from '../../src/errors/HttpErrors';

// Mock the service
jest.mock('../../src/services/UserService');

describe('UserController', () => {
  let userController: ReturnType<typeof createUserController>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const testUser = new User(
    '1',
    'testuser',
    'test@example.com',
    'guest',
    'Test User',
    '123-456-7890',
    'password123'
  );

  beforeEach(() => {
    // Create a new mock service for each test
    mockUserService = new (UserService as any)() as jest.Mocked<UserService>;
    userController = createUserController(mockUserService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('registerUser', () => {
    it('should create a new user and return 201', async () => {
      mockRequest.body = {
        id: '2',
        username: 'newUser',
        email: 'new@example.com',
        password: 'password',
        role: 'guest',
        name: 'New User',
        contact: '123-456-7890',
      };

      mockUserService.createUser.mockResolvedValue(testUser);

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserService.createUser).toHaveBeenCalledWith('2', 'newUser', 'new@example.com', 'password', 'guest', 'New User', '123-456-7890');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: testUser,
      });
    });

    it('should call next with a ConflictError if username already exists', async () => {
        const error = new ConflictError('Username already exists');
        mockRequest.body = {
            id: '1',
            username: 'existingUser',
            email: 'new@example.com',
            password: 'password',
            role: 'guest',
            name: 'New User',
            contact: '123-456-7890',
        };

        mockUserService.createUser.mockRejectedValue(error);

        await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should call next with a BadRequestError if required fields are missing', async () => {
      mockRequest.body = { username: 'newUser' }; // Missing fields

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new BadRequestError('All fields are required'));
    });
  });
});
