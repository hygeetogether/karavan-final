// tests/controllers/CaravanController.test.ts

import { createCaravanController } from '../../src/controllers/CaravanController';
import { CaravanService } from '../../src/services/CaravanService';
import { User } from '../../src/models/User';
import { Caravan } from '../../src/models/Caravan';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../src/errors/HttpErrors';

jest.mock('../../src/services/CaravanService');

describe('CaravanController', () => {
  let caravanController: ReturnType<typeof createCaravanController>;
  let mockCaravanService: jest.Mocked<CaravanService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  const hostUser = new User('host1', 'host', 'host@test.com', 'host', 'Host', '123', 'pass');
  const guestUser = new User('guest1', 'guest', 'guest@test.com', 'guest', 'Guest', '456', 'pass');
  const testCaravan = new Caravan('caravan1', 'host1', 'Test Caravan', 4, [], [], { latitude: 0, longitude: 0 }, 100);

  beforeEach(() => {
    mockCaravanService = new (CaravanService as any)() as jest.Mocked<CaravanService>;
    caravanController = createCaravanController(mockCaravanService);

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('createCaravan', () => {
    it('should create a caravan and return 201', async () => {
        mockRequest.body = { id: 'caravan2', hostId: 'host1', name: 'New Caravan', capacity: 2, amenities: ['wifi'], location: { lat: 1, lon: 1 }, dailyRate: 150 };
        mockCaravanService.createCaravan.mockResolvedValue(testCaravan);

        await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockCaravanService.createCaravan).toHaveBeenCalledWith('caravan2', 'host1', 'New Caravan', 2, ['wifi'], [], { lat: 1, lon: 1 }, 150);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Caravan created successfully', caravan: testCaravan });
    });

    it('should call next with BadRequestError if fields are missing', async () => {
      mockRequest.body = { hostId: 'host1' };
      await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new BadRequestError('Missing required fields for caravan creation'));
    });

    it('should call next with an error if the service throws one', async () => {
        const error = new NotFoundError('Host not found');
        mockRequest.body = { id: 'c1', hostId: 'nonexistent', name: 'New Caravan', capacity: 2, amenities: [], location: {}, dailyRate: 150 };
        mockCaravanService.createCaravan.mockRejectedValue(error);
        await caravanController.createCaravan(mockRequest as Request, mockResponse as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCaravanById', () => {
    it('should return a caravan and status 200 if found', async () => {
        mockRequest.params = { id: 'caravan1' };
        mockCaravanService.getCaravanById.mockResolvedValue(testCaravan);

        await caravanController.getCaravanById(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockCaravanService.getCaravanById).toHaveBeenCalledWith('caravan1');
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(testCaravan);
    });

    it('should call next with NotFoundError if caravan is not found', async () => {
        const error = new NotFoundError('Caravan not found');
        mockRequest.params = { id: 'nonexistent' };
        mockCaravanService.getCaravanById.mockRejectedValue(error);

        await caravanController.getCaravanById(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllCaravans', () => {
    it('should return an array of caravans and status 200', async () => {
        const caravans = [testCaravan];
        mockCaravanService.getAllCaravans.mockResolvedValue(caravans);

        await caravanController.getAllCaravans(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockCaravanService.getAllCaravans).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(caravans);
    });
  });
});
