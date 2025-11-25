// tests/services/CaravanService.test.ts

import { CaravanService } from '../../src/services/CaravanService';
import { CaravanRepository } from '../../src/repositories/CaravanRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import { Caravan, CaravanStatus } from '../../src/models/Caravan';
import { User, Role } from '../../src/models/User';

jest.mock('../../src/repositories/CaravanRepository');
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/lib/prisma', () => ({
    __esModule: true,
    default: {
        caravan: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
        user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    },
}));

describe('CaravanService', () => {
    let caravanService: CaravanService;
    let mockCaravanRepo: jest.Mocked<CaravanRepository>;
    let mockUserRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockCaravanRepo = new CaravanRepository() as jest.Mocked<CaravanRepository>;
        mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
        caravanService = new CaravanService(mockCaravanRepo, mockUserRepo);
    });

    describe('create', () => {
        it('should create a caravan successfully if user is host', async () => {
            const caravanData = {
                ownerId: 1,
                name: 'Cozy Caravan',
                capacity: 4,
                amenities: ['WiFi'],
                photos: ['url'],
                location: { latitude: 0, longitude: 0, address: 'Test' },
                status: 'AVAILABLE' as CaravanStatus,
                dailyRate: 100
            };

            const host: User = {
                id: 1,
                name: 'Host User',
                email: 'host@test.com',
                role: 'HOST',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockUserRepo.findById.mockReturnValue(Promise.resolve(host));
            mockCaravanRepo.add.mockReturnValue(Promise.resolve());

            const caravan = await caravanService.create(caravanData);

            expect(caravan).toBeDefined();
            expect(caravan.name).toBe(caravanData.name);
            expect(mockCaravanRepo.add).toHaveBeenCalled();
        });

        it('should throw error if user is not a host', async () => {
            const caravanData = {
                ownerId: 1,
                name: 'Cozy Caravan',
                capacity: 4,
                amenities: ['WiFi'],
                photos: ['url'],
                location: { latitude: 0, longitude: 0, address: 'Test' },
                status: 'AVAILABLE' as CaravanStatus,
                dailyRate: 100
            };

            const guest: User = {
                id: 1,
                name: 'Guest User',
                email: 'guest@test.com',
                role: 'GUEST',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockUserRepo.findById.mockReturnValue(Promise.resolve(guest));

            await expect(caravanService.create(caravanData)).rejects.toThrow('User is not a host');
            expect(mockCaravanRepo.add).not.toHaveBeenCalled();
        });

        it('should throw error if user not found', async () => {
            const caravanData = {
                ownerId: 1,
                name: 'Cozy Caravan',
                capacity: 4,
                amenities: ['WiFi'],
                photos: ['url'],
                location: { latitude: 0, longitude: 0, address: 'Test' },
                status: 'AVAILABLE' as CaravanStatus,
                dailyRate: 100
            };

            mockUserRepo.findById.mockReturnValue(Promise.resolve(undefined));

            await expect(caravanService.create(caravanData)).rejects.toThrow('Host with ID 1 not found');
        });
    });

    describe('getById', () => {
        it('should return caravan if found', async () => {
            const caravan: Caravan = {
                id: 1,
                ownerId: 1,
                name: 'Cozy Caravan',
                capacity: 4,
                amenities: ['WiFi'],
                photos: ['url'],
                location: { latitude: 0, longitude: 0, address: 'Test' },
                status: 'AVAILABLE',
                dailyRate: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockCaravanRepo.findById.mockReturnValue(Promise.resolve(caravan));

            const result = await caravanService.getById(1);
            expect(result).toBe(caravan);
        });

        it('should throw error if caravan not found', async () => {
            mockCaravanRepo.findById.mockReturnValue(Promise.resolve(undefined));
            await expect(caravanService.getById(1)).rejects.toThrow('Caravan with ID 1 not found');
        });
    });
});
