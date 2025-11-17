// src/models/Caravan.ts

export class Caravan {
  id: string;
  hostId: string;
  name: string;
  capacity: number;
  amenities: string[];
  photos: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'available' | 'reserved' | 'maintenance';
  dailyRate: number;

  constructor(
    id: string,
    hostId: string,
    name: string,
    capacity: number,
    amenities: string[],
    photos: string[],
    location: { latitude: number; longitude: number },
    dailyRate: number,
    status: 'available' | 'reserved' | 'maintenance' = 'available',
  ) {
    this.id = id;
    this.hostId = hostId;
    this.name = name;
    this.capacity = capacity;
    this.amenities = amenities;
    this.photos = photos;
    this.location = location;
    this.status = status;
    this.dailyRate = dailyRate;
  }

  updateStatus(newStatus: 'available' | 'reserved' | 'maintenance'): void {
    this.status = newStatus;
  }
}
