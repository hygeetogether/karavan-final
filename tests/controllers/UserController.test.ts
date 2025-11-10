// tests/controllers/UserController.test.ts

import { createUserController } from '../../controllers/UserController';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../models/User';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../errors/HttpErrors';

// Mock the repository
jest.mock('../../repositories/UserRepository');

describe('UserController', () => {
  let userController: ReturnType<typeof createUserController>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const testUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'guest',
    name: 'Test User',
    contact: '123-456-7890',
    rating: 0,
    identityVerified: false,
  };

  beforeEach(() => {
    // Create a new mock repository for each test
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userController = createUserController(mockUserRepository);

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
        username: 'newUser',
        email: 'new@example.com',
        password: 'password',
        role: 'guest',
        name: 'New User',
        contact: '123-456-7890',
      };

      mockUserRepository.findByUsername.mockReturnValue(undefined);
      mockUserRepository.create.mockImplementation((user: User) => {});

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('newUser');
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User registered successfully',
      }));
    });

    it('should call next with a ConflictError if username already exists', async () => {
      mockRequest.body = {
        username: 'existingUser',
        email: 'new@example.com',
        password: 'password',
        role: 'guest',
        name: 'New User',
        contact: '123-456-7890',
      };

      mockUserRepository.findByUsername.mockReturnValue({ ...testUser, username: 'existingUser' });

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new ConflictError('Username already exists'));
    });

    it('should call next with a BadRequestError if required fields are missing', async () => {
      mockRequest.body = { username: 'newUser' }; // Missing fields

      await userController.registerUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new BadRequestError('All fields are required'));
    });
  });

  describe('loginUser', () => {
    it('should login a user and return 200', async () => {
      mockRequest.body = { username: 'testuser', password: 'password123' };
      mockUserRepository.findByUsername.mockReturnValue(testUser);

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login successful',
      }));
    });

    it('should call next with UnauthorizedError for a non-existent username', async () => {
      mockRequest.body = { username: 'nouser', password: 'password123' };
      mockUserRepository.findByUsername.mockReturnValue(undefined);

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError('Invalid credentials'));
    });

    it('should call next with UnauthorizedError for an incorrect password', async () => {
      mockRequest.body = { username: 'testuser', password: 'wrongpassword' };
      mockUserRepository.findByUsername.mockReturnValue(testUser);

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError('Invalid credentials'));
    });

    it('should call next with BadRequestError if password is not provided', async () => {
      mockRequest.body = { username: 'testuser' };

      await userController.loginUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new BadRequestError('Username and password are required'));
    });
  });
});
