// tests/controllers/CaravanController.test.ts

import { createCaravanController } from '../../controllers/CaravanController';
import { CaravanRepository } from '../../repositories/CaravanRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../models/User';
import { Caravan } from '../../models/Caravan';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../errors/HttpErrors';

jest.mock('../../repositories/CaravanRepository');
jest.mock('../../repositories/UserRepository');

describe('CaravanController', () => {
  let caravanController: ReturnType<typeof createCaravanController>;
  let mockCaravanRepository: jest.Mocked<CaravanRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const hostUser: User = { id: 'host1', role: 'host', username: 'host', email: '', password: '', name: '', contact: '', rating: 0, identityVerified: true };
  const guestUser: User = { id: 'guest1', role: 'guest', username: 'guest', email: '', password: '', name: '', contact: '', rating: 0, identityVerified: false };
  const testCaravan: Caravan = { id: 'caravan1', hostId: 'host1', name: 'Test Caravan', capacity: 4, amenities: [], photos: [], location: { latitude: 0, longitude: 0 }, status: 'available', dailyRate: 100 };

  beforeEach(() => {
    mockCaravanRepository = new CaravanRepository() as jest.Mocked<CaravanRepository>;
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    caravanController = createCaravanController(mockCaravanRepository, mockUserRepository);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createCaravan', () => {
    it('should create a caravan and return 201', async () => {
      mockRequest.body = { hostId: 'host1', name: 'New Caravan', capacity: 2, amenities: ['wifi'], location: { lat: 1, lon: 1 }, dailyRate: 150 };
      mockUserRepository.findById.mockReturnValue(hostUser);

      await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockUserRepository.findById).toHaveBeenCalledWith('host1');
      expect(mockCaravanRepository.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Caravan created successfully' }));
    });

    it('should call next with BadRequestError if fields are missing', async () => {
      mockRequest.body = { hostId: 'host1' };
      await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new BadRequestError('Missing required fields for caravan creation'));
    });

    it('should call next with NotFoundError if host does not exist', async () => {
      mockRequest.body = { hostId: 'nonexistent', name: 'New Caravan', capacity: 2, amenities: [], location: {}, dailyRate: 150 };
      mockUserRepository.findById.mockReturnValue(undefined);
      await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Host with ID nonexistent not found or is not a host'));
    });

    it('should call next with NotFoundError if user is not a host', async () => {
        mockRequest.body = { hostId: 'guest1', name: 'New Caravan', capacity: 2, amenities: [], location: {}, dailyRate: 150 };
        mockUserRepository.findById.mockReturnValue(guestUser);
        await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Host with ID guest1 not found or is not a host'));
    });
  });

  describe('getCaravanById', () => {
    it('should return a caravan and status 200 if found', async () => {
        mockRequest.params = { id: 'caravan1' };
        mockCaravanRepository.findById.mockReturnValue(testCaravan);

        await caravanController.getCaravanById(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockCaravanRepository.findById).toHaveBeenCalledWith('caravan1');
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(testCaravan);
    });

    it('should call next with NotFoundError if caravan is not found', async () => {
        mockRequest.params = { id: 'nonexistent' };
        mockCaravanRepository.findById.mockReturnValue(undefined);

        await caravanController.getCaravanById(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Caravan with ID nonexistent not found'));
    });
  });

  describe('getAllCaravans', () => {
    it('should return an array of caravans and status 200', async () => {
        const caravans = [testCaravan];
        mockCaravanRepository.findAll.mockReturnValue(caravans);

        await caravanController.getAllCaravans(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockCaravanRepository.findAll).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(caravans);
    });
  });
});
