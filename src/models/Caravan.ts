import { CaravanStatus } from '@prisma/client';

export { CaravanStatus };

export interface Caravan {
  id: number;
  ownerId: number; // user id of the host
  name: string;
  capacity: number; // number of passengers
  amenities: string[]; // e.g., ['WiFi', 'Kitchen']
  photos: string[]; // URLs to images
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  nearbyFacilities?: { type: string; name: string; distance: string }[];
  tags?: string[];
  status: CaravanStatus;
  dailyRate: number; // price per day in KRW
  createdAt: Date;
  updatedAt: Date;
}
