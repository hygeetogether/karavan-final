// src/models/Caravan.ts

export interface Caravan {
  id: string;
  hostId: string; // The ID of the user who owns the caravan
  name: string;
  capacity: number;
  amenities: string[];
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'available' | 'reserved' | 'maintenance';
  dailyRate: number; // Daily rental price
}
